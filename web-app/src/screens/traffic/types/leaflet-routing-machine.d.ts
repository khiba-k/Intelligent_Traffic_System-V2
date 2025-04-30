// src/types/leaflet-routing-machine.d.ts
import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function waypoint(
      latlng: L.LatLngExpression,
      name?: string,
      options?: any
    ): any;
    class Line {
      constructor(route: any, options?: any);
    }
    class OSRMv1 {
      constructor(options?: any);
    }

    export function osrmv1(arg0: {
      serviceUrl: string;
      showAlternatives: boolean;
      alternatives: boolean;
    }) {
      throw new Error("Function not implemented.");
    }
  }
}
