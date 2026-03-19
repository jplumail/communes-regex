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

## Mise à jour des données IGN

Les données `web/data/*.json` sont mises à jour automatiquement chaque lundi à `05:15 UTC`
via le workflow GitHub Actions `Update IGN data`.

Le workflow peut aussi être lancé manuellement depuis l'onglet Actions de GitHub grâce à
`workflow_dispatch`.

Lors d'un lancement manuel sur une branche secondaire, le workflow committe les fichiers
mis à jour sur cette branche et ne déploie pas Firebase. Le déploiement automatique reste
réservé à `main`.

## Données

Les données des communes viennent de la base [Admin Express](https://geoservices.ign.fr/adminexpress) de l'IGN.
