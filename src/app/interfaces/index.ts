// REFER docs.petabencana.id (move to api.urbanriskmap.org ?)
// Update interface definitions

/*
// Interface template
export interface InterfaceName {
  [name: string]: any;
}
*/

export interface EnvironmentInterface {
  production: boolean;
  envName: string;
  servers: {
    data: string;
    sensors: string;
    settings: {
      reportTimeperiod: number;
    };
  };
  map: {
    accessToken: string;
    center: number[];
    initZoom: number;
    minZoom: number;
    baseMapStyle: string;
  };
  locales: {
    supportedLanguages: {
      code: string;
      name: string;
    }[];
    defaultLanguage: string;
    timezone: string;
  };
}

export interface AreaInterface {
  area_id: string;
  area_name: string;
  city_name: string;
  district_id: string;
  geom_id: string;
  last_updated: string;
  parent_name: string;
  state: number;
}

export interface ReportInterface {
  created_at: string;
  disaster_type: string;
  image_url: string;
  pkey: string;
  report_data: string | null; // contains json string
  /*
  report_data: {
    flood_depth?: number
    report_type: string
  }
  */
  source: string;
  status: string;
  tags: string; // contains json string
  /*
  tags: {
    district_id: string,
    local_area_id: string,
    instance_region_code: string
  };
  */
  text: string;
  title: string;
  url: string;
}

export interface SensorInterface {
  id: number;
  class: string;
  created: string;
  observations: string;
  type: string;
  uid: string;
  units: string;
}

export interface Region {
  name: string;
  code: string;
  bounds: {
    sw: number[];
    ne: number[];
  };
}

export interface LayerMetadata {
  name: string;
  server: string;
  path?: string;
  flags: {
    [name: string]: any
  };
  responseType: string;
  uniqueKey: string;
  selected: {
    type: string;
    style: {
      [name: string]: any
    };
  };
  placeBelow?: string;
}

export interface LayerSettings {
  id: string;
  type: string;
  source: {
    type: string;
    data: object|null;
  };
  layout?: {
    [name: string]: any;
  };
  paint?: {
    [name: string]: any;
  };
  filter: any[];
}
