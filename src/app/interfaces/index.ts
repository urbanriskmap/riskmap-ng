// REFER docs.petabencana.id (move to api.urbanriskmap.org ?)
// Update interface definitions

/*
// Interface template
export interface InterfaceName {
  [name: string]: any;
}
*/

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
