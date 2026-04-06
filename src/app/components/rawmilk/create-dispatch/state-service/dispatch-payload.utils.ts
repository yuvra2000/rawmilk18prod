import { createFormData } from '../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';
export class DispatchPayloadBuilder {
  private static getCommonPayload() {
    return {
      //   GroupId: localStorage.getItem('GroupId') || '',
      ForApp: '0',
    };
  }

  private static getToken() {
    return localStorage.getItem('AccessToken') || '';
  }

  // ✅ 1. INITIAL LOAD
  static buildDispatchPrefetchPayload(structureData: any) {
    return createFormData(this.getToken(), {
      ...this.getCommonPayload(),

      indentId: structureData?.Id,
      //   target_date: structureData?.targetdate,
      //   status: structureData?.status,
    });
  }

  // ✅ 2. SUBMIT
  static buildFinalDispatchPayload(
    formdata: any,
    prefetch: any,
    structureData: any,
  ) {
    console.log('buildFinalDispatchPayload called with:', {
      formdata,
      prefetch,
      structureData,
    });

    const item = prefetch?.Data?.[0] || {};

    // ✅ 1. Chambers Mapping
    const chambers = (formdata.rows || []).map((row: any, index: number) => {
      // const milkTypeData =
      //   index === 0 && !row.milkType?.id ? item : row.milkType;

      return {
        chamber: row.chamber_no || '',
        milk_id: row.milkType?.id || '',
        milk_type: row.milkType?.code || '',
        milk_type_name: row.milkType?.name || '',
        temperature: row.temperature || '',
        quantity: row.quantity || '',
        fat_percent: row.fat || '',
        snf_percent: row.snf || '',
        mbrt: row.mbrt || '',
      };
    });

    // ✅ 2. Sub MCC Mapping
    const subMcc = (formdata.mccs || []).map((mcc: any) => ({
      mcc_id: mcc.mccSelect?.mcc_id || '',
      mcc_code: mcc.mccSelect?.code || '',
      mcc_name: mcc.mccSelect?.name || '',
      Chamber: (mcc.chambers || []).map((chamber: any) => ({
        milk_id: chamber.milkType?.id || '',
        milk_type: chamber.milkType?.code || '',
        milk_type_name: chamber.milkType?.name || '',
        chamber: chamber.chamber_no || '',
        temperature: chamber.temperature || '',
        quantity: chamber.quantity || '',
        fat_percent: chamber.fat || '',
        snf_percent: chamber.snf || '',
        mbrt: chamber.mbrt || '',
      })),
    }));

    // ✅ 3. Main Payload Object
    const payload = [
      {
        m_rm_indent_id: item?._id?.$oid || '',
        indent_no: item?.indent_no || '',
        m_parent_indent_id: item?.m_parent_indent_id?.$oid || '',
        target_date: item?.target_date || '',
        dispatch_date: formdata.dispatchDate || '',

        mcc_id: item?.mcc_id || '',
        mcc_code: item?.mcc_code || '',
        mcc_name: item?.mcc_name || '',

        supplier_id: item?.supplier_id || '',
        supplier_code: item?.supplier_code || '',
        supplier_name: item?.supplier_name || '',

        plant_id: item?.plant_id || '',
        plant_code: item?.plant_code || '',
        plant_name: item?.plant_name || '',

        lr_no: formdata.Lr_nu || '',
        vehicle_no: formdata.vehicle?.VehicleNo || '',
        imei_no: '', //as discussed with pawan sir imei number send ""

        driver_name: formdata.DriverName || '',
        driver_contact_no: formdata.Driver_no || '',

        // ✅ transporter fix (important)
        transporter_id: formdata.transporter.TransporterId || '',
        transporter_name: formdata.transporter.TransporterName || '',
        transporter_code: formdata.transporter.TransporterCode || '',

        remark: formdata.remarks || '',

        Chamber: chambers,
        SubMcc: subMcc,
      },
    ];

    // ✅ 4. Final FormData
    const formData = new FormData();
    formData.append('dispatchData', JSON.stringify(payload));
    formData.append('indentId', structureData?.Id || '');
    formData.append('AccessToken', this.getToken());
    formData.append('GroupId', localStorage.getItem('GroupId') || '');
    formData.append('ForApp', '0');

    return formData;
  }
  static buildFinalDirectDispatchPayload(
    formdata: any,
    prefetch: any,
    structureData: any,
  ) {
    console.log('buildFinalDispatchPayload called with:', {
      formdata,
      prefetch,
      structureData,
    });

    const item = prefetch?.Data?.[0] || {};

    // ✅ 1. Chambers Mapping
    const chambers = (formdata.rows || []).map((row: any, index: number) => {
      // const milkTypeData =
      //   index === 0 && !row.milkType?.id ? item : row.milkType;

      return {
        chamber: row.chamber_no || '',
        milk_id: row.milkType?.id || '',
        milk_type: row.milkType?.code || '',
        milk_type_name: row.milkType?.name || '',
        temperature: row.temperature || '',
        quantity: row.quantity || '',
        fat_percent: row.fat || '',
        snf_percent: row.snf || '',
        mbrt: row.mbrt || '',
      };
    });

    // ✅ 2. Sub MCC Mapping
    const subMcc = (formdata.mccs || []).map((mcc: any) => ({
      mcc_id: mcc.mccSelect?.mcc_id || '',
      mcc_code: mcc.mccSelect?.code || '',
      mcc_name: mcc.mccSelect?.name || '',
      Chamber: (mcc.chambers || []).map((chamber: any) => ({
        milk_id: chamber.milkType?.id || '',
        milk_type: chamber.milkType?.code || '',
        milk_type_name: chamber.milkType?.name || '',
        chamber: chamber.chamber_no || '',
        temperature: chamber.temperature || '',
        quantity: chamber.quantity || '',
        fat_percent: chamber.fat || '',
        snf_percent: chamber.snf || '',
        mbrt: chamber.mbrt || '',
      })),
    }));

    // ✅ 3. Main Payload Object
    const payload = [
      {
        m_rm_indent_id: '',
        indent_no: '',
        m_parent_indent_id: '',
        target_date: '',
        dispatch_date: formdata.dispatchDate || '',

        mcc_id: item?.mcc_id || '',
        mcc_code: item?.mcc_code || '',
        mcc_name: item?.mcc_name || '',

        supplier_id: '',
        supplier_code: '',
        supplier_name: '',

        plant_id: formdata.plant?.plant_id || '',
        plant_code: formdata.plant?.plant_code || '',
        plant_name: formdata.plant?.plant_name || '',

        lr_no: formdata.Lr_nu || '',
        vehicle_no: formdata.vehicle?.VehicleNo || '',
        imei_no: '', //as discussed with pawan sir imei number send ""

        driver_name: formdata.DriverName || '',
        driver_contact_no: formdata.Driver_no || '',

        // ✅ transporter fix (important)
        transporter_id: formdata.transporter.TransporterId || '',
        transporter_name: formdata.transporter.TransporterName || '',
        transporter_code: formdata.transporter.TransporterCode || '',

        remark: formdata.remarks || '',

        Chamber: chambers,
        SubMcc: subMcc,
      },
    ];

    // ✅ 4. Final FormData
    const formData = new FormData();
    formData.append('dispatchData', JSON.stringify(payload));
    formData.append('indentId', structureData?.Id || '');
    formData.append('AccessToken', this.getToken());
    formData.append('GroupId', localStorage.getItem('GroupId') || '');
    formData.append('ForApp', '0');

    return formData;
  }
}
