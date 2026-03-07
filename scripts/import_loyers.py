import argparse
import re
from pathlib import Path
import pandas as pd


def norm_insee(value):
    if pd.isna(value):
        return None
    s = re.sub(r"\D", "", str(value).strip())
    if not s:
        return None
    return s.zfill(5) if len(s) <= 5 else s


def pick_col(df: pd.DataFrame, candidates):
    low = {c.lower().strip(): c for c in df.columns}
    for cand in candidates:
        c = low.get(cand.lower().strip())
        if c:
            return c
    for cand in candidates:
        for col in df.columns:
            if cand.lower() in col.lower():
                return col
    return None


def to_num(s):
    return pd.to_numeric(s, errors="coerce")


def load_anil(path: str, year: int, quarter: str):
    df = pd.read_csv(path, sep=None, engine="python")
    c_insee = pick_col(df, ["code_insee", "insee", "codgeo", "code_commune_insee", "code_commune"])
    c_commune = pick_col(df, ["commune", "nom_commune", "libelle"])
    c_dept = pick_col(df, ["departement_code", "code_departement", "dep"])
    c_region = pick_col(df, ["region_code", "code_region", "reg"])

    def find_many(keys):
        return pick_col(df, keys)

    out = pd.DataFrame(
        {
            "insee_code": df[c_insee].map(norm_insee) if c_insee else None,
            "commune": df[c_commune] if c_commune else None,
            "departement_code": df[c_dept].astype(str).str.zfill(2) if c_dept else None,
            "region_code": df[c_region].astype(str).str.zfill(2) if c_region else None,
            "source": "ANIL_CarteDesLoyers",
            "year": year,
            "quarter": quarter,
            "loyer_m2_cc_app_all": to_num(df[find_many(["loyer_m2_cc_app_all", "app_all", "appart_toutes", "loyer_m2_appart"]]))
            if find_many(["loyer_m2_cc_app_all", "app_all", "appart_toutes", "loyer_m2_appart"])
            else None,
            "loyer_m2_cc_app_t1t2": to_num(df[find_many(["loyer_m2_cc_app_t1t2", "t1t2", "app_t1", "app_t2"])])
            if find_many(["loyer_m2_cc_app_t1t2", "t1t2", "app_t1", "app_t2"])
            else None,
            "loyer_m2_cc_app_t3plus": to_num(df[find_many(["loyer_m2_cc_app_t3plus", "t3plus", "app_t3", "app_t4", "app_t5"])])
            if find_many(["loyer_m2_cc_app_t3plus", "t3plus", "app_t3", "app_t4", "app_t5"])
            else None,
            "loyer_m2_cc_house": to_num(df[find_many(["loyer_m2_cc_house", "maison", "loyer_m2_maison"])])
            if find_many(["loyer_m2_cc_house", "maison", "loyer_m2_maison"])
            else None,
            "r2_app_all": to_num(df[find_many(["r2_app_all"])]) if find_many(["r2_app_all"]) else None,
            "r2_app_t1t2": to_num(df[find_many(["r2_app_t1t2"])]) if find_many(["r2_app_t1t2"]) else None,
            "r2_app_t3plus": to_num(df[find_many(["r2_app_t3plus"])]) if find_many(["r2_app_t3plus"]) else None,
            "r2_house": to_num(df[find_many(["r2_house"])]) if find_many(["r2_house"]) else None,
            "n_obs_app_all": to_num(df[find_many(["n_obs_app_all"])]) if find_many(["n_obs_app_all"]) else None,
            "n_obs_app_t1t2": to_num(df[find_many(["n_obs_app_t1t2"])]) if find_many(["n_obs_app_t1t2"]) else None,
            "n_obs_app_t3plus": to_num(df[find_many(["n_obs_app_t3plus"])]) if find_many(["n_obs_app_t3plus"]) else None,
            "n_obs_house": to_num(df[find_many(["n_obs_house"])]) if find_many(["n_obs_house"]) else None,
            "pred_int_low_app_all": to_num(df[find_many(["pred_int_low_app_all"])]) if find_many(["pred_int_low_app_all"]) else None,
            "pred_int_high_app_all": to_num(df[find_many(["pred_int_high_app_all"])]) if find_many(["pred_int_high_app_all"]) else None,
            "pred_int_low_house": to_num(df[find_many(["pred_int_low_house"])]) if find_many(["pred_int_low_house"]) else None,
            "pred_int_high_house": to_num(df[find_many(["pred_int_high_house"])]) if find_many(["pred_int_high_house"]) else None,
        }
    )
    out = out.dropna(subset=["insee_code"]).drop_duplicates(subset=["insee_code"])
    return out


def load_oll(path: str, year: int):
    df = pd.read_csv(path, sep=None, engine="python")
    zone = pick_col(df, ["zone", "agglomeration", "territoire", "ville_centre"])
    typologie = pick_col(df, ["typologie", "type", "taille", "pieces"])
    epoque = pick_col(df, ["epoque", "periode", "construction"])
    loyer_m2 = pick_col(df, ["loyer_m2", "loyer m2", "loyer au m2"])
    out = pd.DataFrame(
        {
            "zone": df[zone] if zone else None,
            "typologie": df[typologie] if typologie else None,
            "epoque": df[epoque] if epoque else None,
            "loyer_m2": to_num(df[loyer_m2]) if loyer_m2 else None,
            "source": "OLL",
            "year": year,
        }
    )
    out = out.dropna(subset=["loyer_m2"])
    return out


def load_paris_encadrement(path: str, year: int):
    df = pd.read_csv(path, sep=None, engine="python")
    secteur = pick_col(df, ["secteur", "quartier"])
    arrondissement = pick_col(df, ["arrondissement", "arrdt"])
    pieces = pick_col(df, ["pieces", "nombre_pieces"])
    epoque = pick_col(df, ["epoque", "periode"])
    meuble = pick_col(df, ["meuble", "meublé"])
    ref = pick_col(df, ["loyer_reference", "reference"])
    minore = pick_col(df, ["loyer_reference_minore", "minore"])
    majore = pick_col(df, ["loyer_reference_majore", "majore"])
    out = pd.DataFrame(
        {
            "secteur": df[secteur] if secteur else None,
            "arrondissement": df[arrondissement].astype(str).str.zfill(2) if arrondissement else None,
            "pieces": to_num(df[pieces]).fillna(1).astype(int) if pieces else 1,
            "epoque": df[epoque] if epoque else None,
            "meuble": df[meuble].astype(str).str.lower().isin(["1", "true", "oui", "meuble", "meublé"])
            if meuble
            else False,
            "loyer_reference": to_num(df[ref]) if ref else None,
            "loyer_reference_minore": to_num(df[minore]) if minore else None,
            "loyer_reference_majore": to_num(df[majore]) if majore else None,
            "source": "PARIS_ENCADREMENT",
            "year": year,
        }
    )
    out = out.dropna(subset=["loyer_reference_majore"])
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--anil")
    parser.add_argument("--oll")
    parser.add_argument("--paris")
    parser.add_argument("--out-dir", default="data/processed")
    parser.add_argument("--year", type=int, default=2025)
    parser.add_argument("--quarter", default="Q3")
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.anil:
        anil = load_anil(args.anil, year=args.year, quarter=args.quarter)
        anil.to_csv(out_dir / "loyers_commune.csv", index=False, encoding="utf-8")
        print(f"Wrote {len(anil)} rows -> {out_dir / 'loyers_commune.csv'}")

    if args.oll:
        oll = load_oll(args.oll, year=args.year)
        oll.to_csv(out_dir / "loyers_oll.csv", index=False, encoding="utf-8")
        print(f"Wrote {len(oll)} rows -> {out_dir / 'loyers_oll.csv'}")

    if args.paris:
        paris = load_paris_encadrement(args.paris, year=args.year)
        paris.to_csv(out_dir / "encadrement_paris.csv", index=False, encoding="utf-8")
        print(f"Wrote {len(paris)} rows -> {out_dir / 'encadrement_paris.csv'}")

    if not args.anil and not args.oll and not args.paris:
        raise SystemExit("Aucune source fournie (utilisez --anil et/ou --oll et/ou --paris).")


if __name__ == "__main__":
    main()
