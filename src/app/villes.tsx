import { useState } from "react";
import Ville from "./ville";


export default function Villes({ inputValue, communesData, lambert93ToViewBox }: {
    inputValue: string | null,
    communesData: GeoJSON.FeatureCollection,
    lambert93ToViewBox: (lambert93: GeoJSON.Position) => GeoJSON.Position
}) {
    let regex: RegExp | null = null;
    if (inputValue) {
        try {
            regex = new RegExp(inputValue, 'i');
        } catch (e) {
            if (e instanceof SyntaxError) {
                regex = null;
            } else {
                throw e;
            }
        }
    } else {
        regex = null;
    }

    function isVilleFiltered(ville: GeoJSON.Feature): boolean {
        if (!inputValue || ville.properties == null) {
            return false;
        }
        if (regex == null) {
            return true;
        }
        return regex.test(ville.properties.NOM)
    }


    return communesData.features.map(feature => {
        return <Ville
            key={feature.properties && feature.properties.ID}
            ville={feature}
            lambert93ToViewBox={lambert93ToViewBox}
            visible={isVilleFiltered(feature)} />
    })
        ;

}