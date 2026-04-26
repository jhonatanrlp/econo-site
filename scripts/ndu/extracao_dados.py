import os
import re
import time
import requests
import pandas as pd
from bs4 import BeautifulSoup


BASE_URL = "https://www.ndu.com.br"

LOGIN_URL = "https://www.ndu.com.br/adm_atletica/login"
HOME_URL = "https://www.ndu.com.br/index.php/adm_atletica/home"
ATLETAS_URL = "https://www.ndu.com.br/adm_atletica/atletas"
MODALIDADE_URL = "https://www.ndu.com.br/adm_atletica/atleta_modalidade"

OUT_CSV = "atletas_modalidades_ndu.csv"
OUT_XLSX = "atletas_modalidades_ndu.xlsx"

senha = 'bbbosbrabo'
usuario = 'aaainsper'

def clean(txt):
    return re.sub(r"\s+", " ", txt or "").strip()


def make_session():
    s = requests.Session()
    s.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "X-Requested-With": "XMLHttpRequest",
        }
    )
    return s


def login(session, login_value, senha_value):
    r = session.get(LOGIN_URL, timeout=30)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")
    payload = {}

    for inp in soup.find_all("input", {"type": "hidden"}):
        name = inp.get("name")
        if name:
            payload[name] = inp.get("value", "")

    payload["login"] = login_value
    payload["senha"] = senha_value

    resp = session.post(LOGIN_URL, data=payload, timeout=30, allow_redirects=True)
    resp.raise_for_status()

    print("Login OK. URL final:", resp.url)
    return resp


def get_page(session, url, referer=None):
    headers = {}
    if referer:
        headers["Referer"] = referer
    r = session.get(url, timeout=30, headers=headers, allow_redirects=True)
    r.raise_for_status()
    return r.text


def parse_atletas(html):
    soup = BeautifulSoup(html, "html.parser")

    table = None
    for t in soup.find_all("table"):
        headers = " | ".join(
            clean(th.get_text(" ", strip=True)).lower()
            for th in t.find_all("th")
        )
        if "nome" in headers and "ndu" in headers:
            table = t
            break

    if table is None:
        return []

    atletas = []

    for tr in table.find_all("tr"):
        tds = tr.find_all("td")
        if not tds:
            continue

        vals = [clean(td.get_text(" ", strip=True)) for td in tds]
        row_text = " ".join(vals).lower()

        if "ordem" in row_text and "nome" in row_text:
            continue

        ordem = vals[0] if len(vals) > 0 else ""
        ndu = vals[1] if len(vals) > 1 else ""
        nome = vals[3] if len(vals) > 3 else ""
        email = vals[4] if len(vals) > 4 else ""
        renovacao = vals[5] if len(vals) > 5 else ""
        status = vals[6] if len(vals) > 6 else ""

        atleta_id = re.sub(r"\D", "", ndu)
        if not atleta_id:
            continue

        atletas.append(
            {
                "ordem": ordem,
                "ndu": ndu,
                "nome": nome,
                "email": email,
                "renovacao": renovacao,
                "status": status,
                "atleta_id": atleta_id,
            }
        )

    uniq = {}
    for a in atletas:
        uniq[a["atleta_id"]] = a

    return list(uniq.values())


def extract_modalidades_cadastradas(html):
    soup = BeautifulSoup(html, "html.parser")
    modalidades = []

    # tenta pegar checkbox marcado
    for inp in soup.find_all("input", {"type": "checkbox"}):
        checked = inp.has_attr("checked") or str(inp.get("checked", "")).lower() in [
            "checked",
            "true",
            "1",
        ]
        if not checked:
            continue

        label = ""
        if inp.has_attr("id"):
            lbl = soup.find("label", attrs={"for": inp["id"]})
            if lbl:
                label = clean(lbl.get_text(" ", strip=True))

        if not label and inp.parent:
            label = clean(inp.parent.get_text(" ", strip=True))

        label = label.replace("□", "").replace("☑", "").replace("✓", "").strip()
        if label and "modalidades" not in label.lower():
            modalidades.append(label)

    modalidades = list(dict.fromkeys([m for m in modalidades if m]))
    if modalidades:
        return modalidades

    # fallback por texto
    text = clean(soup.get_text("\n", strip=True))
    if "Modalidades cadastradas" in text:
        start = text.find("Modalidades cadastradas")
        end = text.find("Modalidades disponíveis")
        if end == -1:
            end = len(text)

        bloco = text[start:end]
        linhas = [clean(x) for x in bloco.split("\n") if clean(x)]

        for line in linhas:
            low = line.lower()
            if low in [
                "modalidades cadastradas",
                "modalidades disponíveis",
                "modalidades disponiveis",
                "ok!",
                "em análise",
                "em analise",
            ]:
                continue
            modalidades.append(line)

    return list(dict.fromkeys([m for m in modalidades if m]))


def main():
    session = make_session()

    # login
    login(session, usuario, senha)

    # abre home só pra confirmar sessão
    home_html = get_page(session, HOME_URL, referer=LOGIN_URL)
    print("Home carregada:", "home" in HOME_URL)

    # pega lista de atletas
    atletas_html = get_page(session, ATLETAS_URL, referer=HOME_URL)
    print("Página de atletas carregada.")

    atletas = parse_atletas(atletas_html)
    print("Total de atletas encontrados:", len(atletas))

    if not atletas:
        with open("debug_atletas.html", "w", encoding="utf-8") as f:
            f.write(atletas_html)
        print("Não achei atletas. Salvei debug_atletas.html.")
        return

    rows = []

    for i, atleta in enumerate(atletas, start=1):
        try:
            print(f"[{i}/{len(atletas)}] {atleta['atleta_id']} - {atleta['nome']}")

            resp = session.post(
                MODALIDADE_URL,
                data={"id_atleta": atleta["atleta_id"]},
                timeout=30,
                headers={"Referer": ATLETAS_URL},
                allow_redirects=True,
            )
            resp.raise_for_status()

            modalidades = extract_modalidades_cadastradas(resp.text)

            rows.append(
                {
                    "ordem": atleta["ordem"],
                    "ndu": atleta["ndu"],
                    "nome": atleta["nome"],
                    "email": atleta["email"],
                    "renovacao": atleta["renovacao"],
                    "status": atleta["status"],
                    "atleta_id": atleta["atleta_id"],
                    "modalidades_cadastradas": " | ".join(modalidades),
                    "qtd_modalidades": len(modalidades),
                }
            )

            time.sleep(0.1)

        except Exception as e:
            print(f"ERRO no atleta {atleta['atleta_id']}: {e}")
            rows.append(
                {
                    "ordem": atleta["ordem"],
                    "ndu": atleta["ndu"],
                    "nome": atleta["nome"],
                    "email": atleta["email"],
                    "renovacao": atleta["renovacao"],
                    "status": atleta["status"],
                    "atleta_id": atleta["atleta_id"],
                    "modalidades_cadastradas": "",
                    "qtd_modalidades": 0,
                }
            )

    df = pd.DataFrame(rows)

    if df.empty:
        print("DataFrame vazio.")
        return

    df.to_csv(OUT_CSV, index=False, encoding="utf-8-sig")
    df.to_excel(OUT_XLSX, index=False)

    print("Pronto.")
    print("CSV:", OUT_CSV)
    print("XLSX:", OUT_XLSX)
    print(df.head(10).to_string(index=False))


if __name__ == "__main__":
    main()