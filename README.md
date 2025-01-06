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
./download.sh
./extract.sh
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