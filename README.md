## Installation

```bash
pnpm install
```

## Développement

```bash
pnpm dev
```

## Build

```bash
./scripts/download.sh
./scripts/extract.sh
uv run scripts/convert.py
pnpm build
```

## Déploiement

Firebase deploy is triggered on push:
```bash
git push
```

## Données

Les données des communes viennent de la base [Admin Express](https://geoservices.ign.fr/adminexpress) de l'IGN.

## Mise à jour des données automatique

Les données `web/data/*.json` sont mises à jour automatiquement chaque lundi à `05:15 UTC`
via le workflow GitHub Actions `Update IGN data`.

Le workflow compare d'abord la version IGN distante avec la version commitée dans
`web/data/admin-express-version.txt`. Si elles sont identiques, il s'arrête avant tout
téléchargement.