//parser.js version 1.1.5
//Соответствует pulse v 1.1.10
//Идентичен классу data_lora из vega_lib.js iotvega pulse
//за исключением того что функция isObject в данном классе метод
class Parser
{
    constructor(dt,data,port,version,key_map)
    {
        this.type_package;
        this.comment;
        this.hex;
        this.hex_array;
        this.charge;
        this.switch_device = new Array();
        this.time;
        this.temperature;
        this.temperature_2;
        this.sensors = new Object();
        this.num_channel = 0;
        this.count = 0;
        this.type_archive;
        this.last_time;
        this.reason;
        this.archive = new Array();
        this.device_type = parseInt(dt);
        this.version = version;
        // if( this.version === undefined ) this.version = 0;
        this.count_rate_active;
        this.rate_active;
        this.kt;
        this.note_1;
        this.note_2;
        this.event;
        this.state;
        this.type_in;
        this.result;
        this.sensor_rate_0;
        this.sensor_rate_1;
        this.sensor_rate_2;
        this.sensor_rate_3;
        this.sensor_rate_4;
        this.sensor_rate_sum;
        
        this.in_move;
        this.angle;
        this.led_duty;
        this.damp;
        this.lux;
        this.dB;
        this.CO2;
        this.coord_status;
        this.lat;
        this.lng;
        this.dir;
        this.speed;
        this.alt;
        this.sat_visible;
        this.sat_used;
        this.alarm;
        
        this.date_1;
        this.date_2;
        this.period_avg_1;
        this.period_avg_2;
        this.A_p_1;
        this.A_m_1;
        this.R_p_1;
        this.R_m_1;
        this.A_p_2;
        this.A_m_2;
        this.R_p_2;
        this.R_m_2;
        this.UUID;
        this.serial;
        this.model;
        this.count_phase;
        this.count_rate;
        this.relay_state;
        this.release_date;
        this.version_soft;
        this.kt;
        this.data_b;
        this.size_package_in;
        this.size_package_out;
        this.num_out;
        this.count_package;
        this.B_1;
        this.B_2;
        this.B_3;
        this.A_1;
        this.A_2;
        this.A_3;
        this.P_1;
        this.P_2;
        this.P_3;
        this.Q_1;
        this.Q_2;
        this.Q_3;
        this.S_1;
        this.S_2;
        this.S_3;
        //клеммная крышка
        this.state_1;
        //корпуса крышка
        this.state_2;
        //Состояние реле ограничения нагрузки
        this.state_3;


        this.note_1;
        this.note_2;
        this.network_address;
        this.time_zone;
        this.period_reconnection_h;
        this.flag_event;
        this.flag_helf_hour;
        this.flag_ack;
        this.limit_power;
        this.accumulation_period_info;
        this.accumulation_period_day_info;
        this.accumulation_period_month_info;
        this.accumulation_period_readings;
        this.accumulation_period_day_readings;
        this.accumulation_period_month_readings;
        this.accumulation_period_instant;
        this.accumulation_period_day_instant;
        this.accumulation_period_month_instant;
        this.tariff_schedule_season_number;
        this.tariff_schedule_code;
        for(var i = 1; i<=15; i++)
        {
            this[`tariff_schedule_minute_end_${i}_zone`] = undefined;
            this[`tariff_schedule_hour_end_${i}_zone`] = undefined;
            this[`tariff_schedule_number_${i}_zone`] = undefined;
        }
        for(var i = 1; i<=10; i++)
        {
            this[`temperature_1wire_${i}`] = undefined;
        }
        this.version_soft_device;
        this.code_error_1;
        this.code_error_2;
        this.code_error_3;
        this.code_error_4;
        this.code_error_5;
        this.diagnostic_codes;
        this.location_description;
        this.version_module_electronic;
        this.version_parameterization;
        this.flag_translation_time;
        this.flag_relay;
        this.state_relay;
        this.info_radiomodule;
        this.nomenal_voltage;
        this.nomenal_current;
        this.code_model;
        this.maximal_current;
        this.limit_active_power;
        this.time_minute_averages_power;
        this.mode_measuring_power;
        this.time_minute_delay_automatic_switching_relay;

        this.selected_d_archive;
        this.selected_m_archive;
        this.selected_y_archive;
        this.cumulative_energy_summary;
        this.cumulative_energy_rate_1;
        this.cumulative_energy_rate_2;
        this.cumulative_energy_rate_3;
        this.cumulative_energy_rate_4;


        this.count_automatic_switching_relay;
        for(var i = 1; i<=31; i++)
        {
            this[`code_page_indication_${i}`] = undefined;
            this[`time_seconds_show_page_indication_${i}`] = undefined;
        }
        this.voltage_A;
        this.voltage_B;
        this.voltage_C;
        this.electric_current_A;
        this.electric_current_B;
        this.electric_current_C;
        this.power_factor_A;
        this.power_factor_B;
        this.power_factor_C;
        this.power_factor_summary;
        this.frequency_network;
        this.status_state;
        this.mv;
        for(var i = 0; i<=12; i++)
        {
            this[`temperature_num_${i}`] = undefined;
        }
        for(var i = 1; i<=31; i++)
        {
            this[`special_day_d_${i}`] = undefined;
            this[`special_day_m_${i}`] = undefined;
            this[`special_day_t_${i}`] = undefined;
        }
        this.selected_d_archive;
        this.selected_date;
        for(var i = 2; i<=48; i++)
        {
            this[`date_${i}`] = undefined;
        }
        this.half_hour_slices_active_power = [];
        this.temp;
        this.journal = [];
        this.number_phase;
        this.active_power_A;
        this.active_power_B;
        this.active_power_C;
        this.active_power_summary;
        this.reactive_power_A;
        this.reactive_power_B;
        this.reactive_power_C;
        this.reactive_power_summary;
        this.total_power_A;
        this.total_power_B;
        this.total_power_C;
        this.total_power_summary;

        this.address;
        this.cmd_code;
        this.state_energy;
        this.size_data;
        this.size_data_package;
        this.num_package;
        this.port = port;
        this.validParse=this.set_data(data,key_map);
    }
    isObject(obj)
    {
        return typeof obj === 'object' && obj !== null;
    }
    _set_last_time()
    {
        try
        {
            var time = this.hex_array[9].toString()+this.hex_array[8].toString()+this.hex_array[7].toString()+this.hex_array[6].toString();
            this.last_time = parseInt(time,16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_hex(hex)
     {
        this.hex = hex;
        this.hex_array = new Array();
        for (var i =0;i<this.hex.length-1;i=i+2)
        {
           this.hex_array.push( this.hex.substring(i, i+2) ); 
        }
        try
        {
           this.type_package=parseInt(this.hex_array[0],16);
           return true;
        }
        catch(err){
           return false;
        }
    }
    _set_type_archive()
    {
        try
        {
            this.type_archive=parseInt(this.hex_array[5],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_charge()
    {
        try
        {
            this.charge=parseInt(this.hex_array[1],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_num_channel()
    {
        try
        {
            this.num_channel=parseInt(this.hex_array[3],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_count()
    {
        try
        {
            this.count=parseInt(this.hex_array[4],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_temperature(b)
    {
        try
        {
            this.temperature=parseInt(this.hex_array[b],16);
            if (this.temperature>127)
            {
                var hex = this.hex_array[b];
                if (hex.length % 2 != 0) {
                    hex = "0" + hex;
                }
                var num = parseInt(hex, 16);
                var maxVal = Math.pow(2, hex.length / 2 * 8);
                if (num > maxVal / 2 - 1) {
                    num = num - maxVal
                }
                this.temperature=num;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_temperature_b2()
    {
        try
        {  
            var hex = this.hex_array[4]+this.hex_array[3];
            if (hex.length % 4 != 0) {
                hex = "0" + hex;
            }
            var num = parseInt(hex, 16);
            var maxVal = Math.pow(2, hex.length / 2 * 8);
            if (num > maxVal / 2 - 1) {
                num = num - maxVal;
            }
            this.temperature=num/10;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_sensors_opt(IndexByteBegin)
    {
        try
        {
            if (IndexByteBegin!==undefined)
            {
                for(var i=1; i<=4; i++)
                {
                    var hex = '';
                    for(var j=1; j<=4; j++)
                    {
                       if (this.hex_array[IndexByteBegin]===undefined) return false;
                       hex = this.hex_array[IndexByteBegin]+hex;
                       IndexByteBegin++;
                    }
                    this.sensors['sensor_'+i] = parseInt(hex,16);
                }
            }
            else
            {
                this.sensors.sensor_1=parseInt(this.hex_array[7]+this.hex_array[6]+this.hex_array[5]+this.hex_array[4],16);
                this.sensors.sensor_2=parseInt(this.hex_array[11]+this.hex_array[10]+this.hex_array[9]+this.hex_array[8],16);
                this.sensors.sensor_3=parseInt(this.hex_array[15]+this.hex_array[14]+this.hex_array[13]+this.hex_array[12],16);
                this.sensors.sensor_4=parseInt(this.hex_array[19]+this.hex_array[18]+this.hex_array[17]+this.hex_array[16],16);
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_sensors(begin_byte)
    {
        try
        {
            if ( begin_byte == undefined ) begin_byte = 8;
            this.sensors.sensor_1=parseInt(this.hex_array[begin_byte+3]+this.hex_array[begin_byte+2]+this.hex_array[begin_byte+1]+this.hex_array[begin_byte],16);
            this.sensors.sensor_2=parseInt(this.hex_array[begin_byte+7]+this.hex_array[begin_byte+6]+this.hex_array[begin_byte+5]+this.hex_array[begin_byte+4],16);
            this.sensors.sensor_3=parseInt(this.hex_array[begin_byte+11]+this.hex_array[begin_byte+10]+this.hex_array[begin_byte+9]+this.hex_array[begin_byte+8],16);
            this.sensors.sensor_4=parseInt(this.hex_array[begin_byte+15]+this.hex_array[begin_byte+14]+this.hex_array[begin_byte+13]+this.hex_array[begin_byte+12],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_reason(b)
    {
        try
        {
            switch (this.hex_array[b]) {
                case '00':
                    this.reason=0
                    break;
                case '01':
                    this.reason=1
                    break;  
                case '02':
                    this.reason=2
                    break;
                case '03':
                    this.reason=3
                    break;
                case '04':
                    this.reason=4
                    break;
                case '05':
                    this.reason=5
                    break;
                case '06':
                    this.reason=5
                    break;
                case '07':
                    this.reason=5
                    break;
                default:
                    this.reason=undefined;
                    break;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_status_smart()
    {
        try
        {
            var status=parseInt(this.hex_array[6],16).toString(2).split('' ).reverse().splice(0,6);
            if (status[0]==1)
            {
                this.state_sensor_0 = true;
            }
            else
            {
                this.state_sensor_0 =false;
            }
            if (status[1]==1)
            {
                this.state_sensor_1 = true;
            }
            else
            {
                this.state_sensor_1 =false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }

    _set_status(indexByte)
    {
        try
        {
            if (indexByte === undefined) indexByte = 6;
            var status=parseInt(this.hex_array[indexByte],16).toString(2).split('' ).reverse().splice(0,6);
            if (status[0]==1)
            {
                //размокнут
                this.state_security = true;
            }
            else
            {
                //замкнут
                this.state_security =false;
            }
            if (status[1]==1)
            {
                //вскрыт
                this.state_tamper = true;
            }
            else
            {
                //не вскрыт
                this.state_tamper = false;
            }
            if (status[2]==1)
            {
                this.hall_1=true;
            }
            else
            {
                this.hall_1=false;
            }
            if (status[3]==1)
            {
                this.hall_2=true;
            }
            else
            {
                this.hall_2=false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_state(bytes)
    {
        try
        {
            if( !this.isObject(bytes)||bytes.length < 4 ) bytes = [28,29,30,31];
            bytes.reverse();
            var state = '';
            for(var i = 0; i<bytes.length; i++)
            {
                state+=this.hex_array[bytes[i]];
            }
            //var state = this.hex_array[31].toString()+this.hex_array[30].toString()+this.hex_array[29].toString()+this.hex_array[28].toString();
            this.state = state;
            var state_int= parseInt(state,16);
            var state_binary = state_int.toString(2).split('' ).reverse();
            if (state_binary[0]==1) 
            {
                this.state_1 = true;
            }
            else
            {
                this.state_1 = false;
            }
            if (state_binary[1]==1) 
            {
                this.state_2 = true;
            }
            else
            {
                this.state_2 = false;
            }
            if (state_binary[2]==1) 
            {
                this.state_3 = true;
            }
            else
            {
                this.state_3 = false;
            }
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_status_tp11(byte)
    {
        try
        {
            if( byte === undefined ) byte = 5;
            var status= parseInt(this.hex_array[byte],16).toString(2).split('' ).reverse().splice(0,6);
            if (status[0]==1&&parseInt(status[0]))
            {
                this.type_powered = 'external';
            }
            else
            {
                this.type_powered = 'battery';
            }
            if (status[1]==1&&parseInt(status[1]))
            {
                this.sensor_danger_1 = true;
            }
            else
            {
               this.sensor_danger_1 = false;
            }
            if (status[2]==1&&parseInt(status[2]))
            {
                this.sensor_danger_2 = true;
            }
            else
            {
               this.sensor_danger_2 = false;
            }
            if (status[3]==1&&parseInt(status[3]))
            {
                this.sensor_out_1 = true;
            }
            else
            {
               this.sensor_out_1 = false;
            }
            if (status[4]==1&&parseInt(status[4]))
            {
                this.sensor_out_2 = true;
            }
            else
            {
               this.sensor_out_2 = false;
            }
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_switch_state_tl11(b)
    {
        try
        {
            var ss= parseInt(this.hex_array[b],16).toString(2).split('' ).reverse().splice(0,6);
            var b1 = ss[0]!==undefined?ss[0].toString():'0';
            var b2 = ss[1]!==undefined?ss[1].toString():'0';
            var reason = b2+b1;
            this.reason = reason;
            //00 - по времени
            //01 - по срабатыванию тампера
            //10 - сработал датчик Холла двери
            //11 - сработал датчик Холла отрыва
           // this.hall_1 = parseInt(ss[2])?true:false;
           // this.hall_2 = parseInt(ss[3])?true:false;
            this.state_tamper = parseInt(ss[2])?true:false;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_switch_state_td12(b)
    {
        try
        {
            var ss= parseInt(this.hex_array[b],16).toString(2).split('' ).reverse().splice(0,6);
            var b1 = ss[0]!==undefined?ss[0].toString():'0';
            var b2 = ss[1]!==undefined?ss[1].toString():'0';
            var reason = b2+b1;
            this.reason = reason;
            //00 - по времени
            //01 - по срабатыванию тампера
            //10 - сработал датчик Холла двери
            //11 - сработал датчик Холла отрыва
            this.hall_1 = parseInt(ss[2])?true:false;
            this.hall_2 = parseInt(ss[3])?true:false;
            this.state_tamper = parseInt(ss[4])?true:false;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_switch_device_smart()
    {
        try
        {
            var sw= parseInt(this.hex_array[2],16).toString(2).split('' ).reverse().splice(0,6);
            this.switch_device=sw;
            if (sw[0]==1)
            {
                this.type_activation = 'ABP';
            }
            else
            {
                this.type_activation = 'OTAA';
            }
            if (sw[1]==1)
            {
                this.state_ack = true;
            }
            else
            {
                this.state_ack = false;
            }
            var b1 = sw[2]!==undefined?sw[2].toString():'0';
            var b2 = sw[3]!==undefined?sw[3].toString():'0';
            var period_connect = b1+b2;
            switch (period_connect) {
                case '00':
                    this.period_connect_minute = 60;
                    break;
                case '10':
                    this.period_connect_minute = 360;
                    break;
                case '01':
                    this.period_connect_minute = 720;
                    break;
                case '11':
                    this.period_connect_minute = 1440;
                break;
                
                default:

                    break;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_switch_device_mbus()
    {
        try
        {
            var sw= parseInt(this.hex_array[2],16).toString(2).split('' ).reverse().splice(0,6);
            this.switch_device=sw;
            if (sw[0]==1)
            {
                this.type_activation = 'ABP';
            }
            else
            {
                this.type_activation = 'OTAA';
            }
            if (sw[1]==1)
            {
                this.state_ack = true;
            }
            else
            {
                this.state_ack = false;
            }
            var b1 = sw[2]!==undefined?sw[2].toString():'0';
            var b2 = sw[3]!==undefined?sw[3].toString():'0';
            var period_connect = b1+b2;
            switch (period_connect) {
                case '00':
                    this.period_connect_minute = 60;
                    break;
                case '10':
                    this.period_connect_minute = 360;
                    break;
                case '01':
                    this.period_connect_minute = 720;
                    break;
                case '11':
                    this.period_connect_minute = 1440;
                break;
                
                default:

                    break;
            }
            this.active_channel_security_1 = sw[4] == 1;
            this.active_channel_security_2 = sw[5] == 1;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_switch_device_tp11()
    {
        try
        {
            var sw= parseInt(this.hex_array[2],16).toString(2).split('' ).reverse().splice(0,6);
            this.switch_device=sw;
            if (sw[0]==1)
            {
                this.type_activation = 'ABP';
            }
            else
            {
                this.type_activation = 'OTAA';
            }
            if (sw[1]==1)
            {
                this.state_ack = true;
            }
            else
            {
                this.state_ack = false;
            }
            var b1 = sw[2]!==undefined?sw[2].toString():'0';
            var b2 = sw[3]!==undefined?sw[3].toString():'0';
            var b3 = sw[4]!==undefined?sw[4].toString():'0';
            var b4 = sw[5]!==undefined?sw[5].toString():'0';
            var period_connect = b1+b2+b3+b4;
            switch (period_connect) {
                case '0000':
                    this.period_connect_minute = 60;
                    break;
                case '1000':
                    this.period_connect_minute = 360;
                    break;
                case '0100':
                    this.period_connect_minute = 720;
                    break;
                case '1100':
                    this.period_connect_minute = 1440;
                break;
                case '0010':
                    this.period_connect_minute = 1;
                    break;
                case '1010':
                    this.period_connect_minute = 3;
                    break;
                case '0110':
                    this.period_connect_minute = 5;
                    break;
                case '1110':
                    this.period_connect_minute = 10;
                    break;
                case '0001':
                    this.period_connect_minute = 15;
                    break;
                case '1001':
                    this.period_connect_minute = 30;
                    break;
                default:
                    
                    break;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_period_connect_minute(b)
    {
        try
        {
            if (b!==undefined)
            {
                var result_int = parseInt(this.hex_array[b],16);
                if (!isNaN(result_int))
                {
                    switch (result_int) {
                        case 1:
                            this.period_connect_minute = 60;
                            break;
                        case 2:
                            this.period_connect_minute = 360;
                            break;
                        case 3:
                            this.period_connect_minute = 720;
                            break;
                        case 4:
                            this.period_connect_minute = 1440;
                        break;
                        default:
                            return false;
                            break;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_collection_period_minute(b)
    {
        try
        {
            if (b!==undefined)
            {
                var result_int = parseInt(this.hex_array[b],16);
                if (!isNaN(result_int))
                {
                    switch (result_int) {
                        case 1:
                            this.collection_period_minute = 5;
                            break;
                        case 2:
                            this.collection_period_minute = 15;
                            break;
                        case 3:
                            this.collection_period_minute = 30;
                            break;
                        case 4:
                            this.collection_period_minute = 60;
                            break;
                        case 5:
                            this.collection_period_minute = 360;
                            break;
                        case 6:
                            this.collection_period_minute = 720;
                            break;
                        case 7:
                            this.collection_period_minute = 1440;
                        break;
                        default:
                            return false;
                        break;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_switch_device()
    {
        try
        {
            this.switch_device=parseInt(this.hex_array[2],16).toString(2).split('' ).reverse().splice(0,6);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_archive()
    {
       for (var i =10;i<this.hex_array.length-3;i=i+4)
         {
             var time = this.last_time*1000;
             if (this.type_archive==0)
             {
                 time = moment(time).subtract((i-10)/4, 'hour' ).unix();
             }
             else if (this.type_archive==1)
             {
                 time = moment(time).subtract((i-10)/4, 'day' ).unix();
             } else if (this.type_archive==2)
             {
                 time = moment(time).subtract((i-10)/4, 'month' ).unix();
             } else if (this.type_archive==3)
             {
             }
             else 
             {
                 return false;
             }
            this.archive.push( [this.hex_array[i+3].toString()+this.hex_array[i+2].toString()+this.hex_array[i+1].toString()+this.hex_array[i].toString(),time]); 
         }
    }
    _set_sensorTP()
    {
        try
        {
            var sensorTP = this.hex_array[7].toString()+this.hex_array[6].toString();
            this.sensorTP = parseInt(sensorTP,16)/100;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_sensorKB()
    {
        try
        {
            var sensorKB = this.hex_array[14].toString()+this.hex_array[13].toString()+this.hex_array[12].toString()+this.hex_array[11].toString();
            this.sensorKB = parseInt(sensorKB,16)/10000;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
   
    _set_model()
    {
        try
        {
            this.model = this.hex_array[9].toString();
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_serial(b1,b2,b3,b4)
    {
        try
        {
            if( b1 === undefined ) b1 = 1;
            if( b2 === undefined ) b2 = 2;
            if( b3 === undefined ) b3 = 3;
            if( b4 === undefined ) b4 = 4;
            this.serial = this.hex_array[b4].toString()+this.hex_array[b3].toString()+this.hex_array[b2].toString()+this.hex_array[b1].toString();
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_time(b1,b2,b3,b4)
    {
        try
        {
            var time = this.hex_array[b4].toString()+this.hex_array[b3].toString()+this.hex_array[b2].toString()+this.hex_array[b1].toString();
            this.time = parseInt(time,16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_release_date(b1,b2,b3,b4)
    {
        try
        {
            if( b1 === undefined ) b1 = 13;
            if( b2 === undefined ) b2 = 14;
            if( b3 === undefined ) b3 = 15;
            if( b4 === undefined ) b4 = 16;
            var time = this.hex_array[b4].toString()+this.hex_array[b3].toString()+this.hex_array[b2].toString()+this.hex_array[b1].toString();
            this.release_date = parseInt(time,16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_version_soft()
    {
        try
        {
            this.version_soft = this.hex_array[20].toString()+this.hex_array[19].toString()+this.hex_array[18].toString()+this.hex_array[17].toString();
            return true;
        }
        catch(err)
        {
            return false;
        }
    } 
    _set_universal_string_ASCII(beginByte, endByte, param)
    {
        try
        {
            var data_h = [];
            for(var i = beginByte; i<=endByte;i++)
            {
                data_h.push(String.fromCharCode('0x'+this.hex_array[i]));
            }
            data_h = data_h.join('');
            this[param] = data_h;
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_1wire(begin,end)
    {
        if( end === undefined ) end = this.hex_array.length-1;
        try
        {
            var num_temperature = 0;
            for( var i = begin; i<=end; i = i + 2 )
            {
                var b1 = this.hex_array[i+1];
                var b2 = this.hex_array[i];
                var valid_b1 = typeof b1 === 'string' && b1.length === 2;
                var valid_b2 = typeof b2 === 'string' && b2.length === 2;
                if( valid_b1 && valid_b2 )
                {
                    var temperature = this._get_universal_float_negative([i,i+1],10);
                    num_temperature++;
                    this[`temperature_1wire_${num_temperature}`] = temperature;
                }
            }
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_data_b(before,end)
    {
        if( end === undefined ) end = this.hex_array.length-1;
        try
        {
            this.data_b = [];
            for(var i = end; i>=before;i--)
            {
                this.data_b.push(this.hex_array[i]);
            }
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_data_b_rev(before,end)
    {
        if( end === undefined ) end = this.hex_array.length-1;
        try
        {
            this.data_b = this.hex_array.slice(before,end);
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_size_package_in()
    {
        try
        {
            var size = this.hex_array[2].toString()+this.hex_array[1].toString();
            this.size_package_in = parseInt(size,16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_count_package()
    {
        try
        {
            this.count_package = parseInt(this.hex_array[5],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_num_out()
    {
        try
        {
            this.num_out = parseInt(this.hex_array[4],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_size_package_out()
    {
        try
        {
            this.size_package_out = parseInt(this.hex_array[3],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_kt()
    {
        try
        {
            var kt = this.hex_array[22].toString()+this.hex_array[21].toString();
            this.kt = parseInt(kt,16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_relay_state()
    {
        try
        {
            var relay_state = parseInt(this.hex_array[12],16);
            this.relay_state = relay_state===1?true:false;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_count_rate()
    {
        try
        {
            this.count_rate = parseInt(this.hex_array[11],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_count_rate_active()
    {
        try
        {
            this.count_rate_active = this.hex_array[9]!='ff'?parseInt(this.hex_array[9],16):'-';
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_note(b1,num)
    {
        try
        {
            this['note_'+num] = parseInt(this.hex_array[b1],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_period_avg(b1,num)
    {
        try
        {
            this['period_avg_'+num] = parseInt(this.hex_array[b1],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_rate_active(b)
    {
        try
        {
            if(!b) b = 10;
            this.rate_active = parseInt(this.hex_array[b],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_count_phase(b1)
    {
        try
        {
            this.count_phase = parseInt(this.hex_array[b1],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_tamper()
    {
        try
        {
            var tamper = parseInt(this.hex_array[3],16);
            if (tamper==1)
            {
                this.state_tamper = false;
            }
            else
            {
                this.state_tamper = true;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_leaking()
    {
        try
        {
            var leaking = parseInt(this.hex_array[9],16);
            if (leaking==1)
            {
                this.leaking = true;
            }
            else
            {
                this.leaking = false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_breakthrough()
    {
        try
        {
            var breakthrough = parseInt(this.hex_array[10],16);
            if (breakthrough==1)
            {
                this.breakthrough = true;
            }
            else
            {
                this.breakthrough = false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_status_sensor_out(byteNum,byteVal)
    {
        try
        {
            if( byteNum == undefined ) byteNum = 2;
            if( byteVal == undefined ) byteVal = 3;
            var numSensor = parseInt(this.hex_array[byteNum],16);
            if (numSensor===1||numSensor===2)
            {
                var valueSensor = parseInt(this.hex_array[byteVal],16);
                if (valueSensor)
                {
                    this['sensor_out_'+numSensor]=true;
                }
                else
                {
                    this['sensor_out_'+numSensor]=false;
                }    
            } 
            else
            {
                return false;
            }
            return true;
        }
        catch(e)
        {
            return false;
        }
    }
    _set_hall_1()
    {
        try
        {
            var hall_1 = parseInt(this.hex_array[3],16);
            if (hall_1==1)
            {
                this.hall_1 = true;
            }
            else
            {
                this.hall_1 = false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _get_number_phaseV2(b1,val)
    {
        var result = {
            status_parse:false
        };
        try
        {
            if(val === undefined) result.hex = this.hex_array[b1];
            else result.hex = val.toString();
            result.binary = parseInt(result.hex,16).toString(2).split('' ).reverse();
            while ( result.binary.length < 8 ) result.binary.push('0');
            result.A = result.binary[0] == 1?true:false;
            result.B = result.binary[1] == 1?true:false;
            result.C = result.binary[2] == 1?true:false;
            var validABC = typeof result.A === 'boolean' && typeof result.B === 'boolean' && typeof result.C === 'boolean';
            if( validABC ) result.status_parse = true;
        }
        catch(err)
        {
            result.status_parse = false;
        }
        finally
        {
            return result;
        }
    }
    _get_number_phase(b1,val)
    {
        var result = {
            status_parse:false
        };
        try
        {
            if(val === undefined) result.hex = this.hex_array[b1];
            else result.hex = val.toString();
            result.binary = parseInt(result.hex,16).toString(2).split('' ).reverse();
            while ( result.binary.length < 8 ) result.binary.push('0');
            result.A = result.binary[0] == 1?true:false;
            result.B = result.binary[1] == 1?true:false;
            result.C = result.binary[2] == 1?true:false;
            var code_phase_binary = result.binary[5] + result.binary[4];
            var code_phase = parseInt(code_phase_binary,2);
            if( code_phase == 1 ) result.code_phase_max_deviation = 'A';
            if( code_phase == 2 ) result.code_phase_max_deviation = 'B';
            if( code_phase == 3 ) result.code_phase_max_deviation = 'C';
            result.end_event_power_lost  = result.binary[6] == 1?true:false;
            result.end_event_exec_cmd_settings = result.binary[7] == 1?true:false;
            var validABC = typeof result.A === 'boolean' && typeof result.B === 'boolean' && typeof result.C === 'boolean';
            var validCodePhase = result.code_phase_max_deviation !== undefined;
            var validEndEvent = typeof result.end_event_power_lost === 'boolean' && typeof result.end_event_exec_cmd_settings === 'boolean';
            if( validABC && validCodePhase && validEndEvent ) result.status_parse = true;
        }
        catch(err)
        {
            result.status_parse = false;
        }
        finally
        {
            return result;
        }
    }
    _get_byte_state(b1)
    {
        var result = {
            status_parse:false
        };
        try
        {
            result.hex = b1;
            result.binary = parseInt(this.hex_array[b1],16).toString(2).split('' ).reverse();
            var code_reason_binary = result.binary[0]+result.binary[1]+result.binary[2]+result.binary[3]+result.binary[4]+result.binary[5]+result.binary[6];
            result.code_reason = parseInt(code_reason_binary,2);
            result.relay_state  = result.binary[7] == 1?true:false;
            var validCodeReason= result.code_reason !== undefined && !isNaN(result.code_reason);
            var validRelayState = typeof result.relay_state === 'boolean';
            if( validCodeReason && validRelayState ) result.status_parse = true;
        }
        catch(err)
        {
            result.status_parse = false;
        }
        finally
        {
            return result;
        }
    }
    _get_universal_float_negative(arr_b,divider)
    {
        this.temp = undefined;
        this._set_universal_float_negative(arr_b,divider,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _get_universal_float_negative_noFF(arr_b,divider)
    {
        this.temp = undefined;
        this._set_universal_float_negative_noFF(arr_b,divider,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _get_universal_float_noFF(arr_b,divider)
    {
        this.temp = undefined;
        this._set_universal_float_noFF(arr_b,divider,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _get_universal_int_noFF(arr_b)
    {
        this.temp = undefined;
        this._set_universal_int_noFF(arr_b,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _get_universal_hex_noFF(arr_b)
    {
        this.temp = undefined;
        this._set_universal_hex(arr_b,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _get_universal_int_negative(arr_b)
    {
        this.temp = undefined;
        this._set_universal_int_negative(arr_b,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _get_universal_int_negative_noFF(arr_b)
    {
        this.temp = undefined;
        this._set_universal_int_negative_noFF(arr_b,'temp');
        var res = this.temp;
        this.temp = undefined;
        return res;
    }
    _set_universal_int_noFF(arr_b,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    if (countMAX!==arr_b.length)
                    {
                        this[param] = result_int;
                    }
                    else
                    {
                        this[param] = undefined;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_int(arr_b,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_param)
            {
                // var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    // if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    // if (countMAX!==arr_b.length)
                    // {
                        this[param] = result_int;
                    // }
                    // else
                    // {
                    //     this[param] = undefined;
                    // }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_int_negative(arr_b,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_param)
            {
                // var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    // if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    var maxVal = Math.pow(2, result.length / 2 * 8);
                    if (result_int > maxVal / 2 - 1) {
                        result_int = result_int - maxVal;
                    }
                    // if (countMAX!==arr_b.length)
                    // {
                        this[param] = result_int;
                    // }
                    // else
                    // {
                    //     this[param] = undefined;
                    // }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_int_negative_noFF(arr_b,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    var maxVal = Math.pow(2, result.length / 2 * 8);
                    if (result_int > maxVal / 2 - 1) {
                        result_int = result_int - maxVal;
                    }
                    if (countMAX!==arr_b.length)
                    {
                        this[param] = result_int;
                    }
                    else
                    {
                        this[param] = undefined;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_float_negative(arr_b,divider,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_divider = typeof divider === 'number';
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_divider&&valid_param)
            {
                // var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    // if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    var maxVal = Math.pow(2, result.length / 2 * 8);
                    if (result_int > maxVal / 2 - 1) {
                        result_int = result_int - maxVal;
                    }
                    // if (countMAX!==arr_b.length)
                    // {
                        this[param] = result_int/divider;
                    // }
                    // else
                    // {
                    //     this[param] = undefined;
                    // }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_float(arr_b,divider,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_divider = typeof divider === 'number';
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_divider&&valid_param)
            {
                // var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    // if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    // if (countMAX!==arr_b.length)
                    // {
                        this[param] = result_int/divider;
                    // }
                    // else
                    // {
                    //     this[param] = undefined;
                    // }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_float_negative_noFF(arr_b,divider,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_divider = typeof divider === 'number';
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_divider&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    var maxVal = Math.pow(2, result.length / 2 * 8);
                    if (result_int > maxVal / 2 - 1) {
                        result_int = result_int - maxVal;
                    }
                    if (countMAX!==arr_b.length)
                    {
                        this[param] = result_int/divider;
                    }
                    else
                    {
                        this[param] = undefined;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_float_noFF(arr_b,divider,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_divider = typeof divider === 'number';
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_divider&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if (!isNaN(result_int))
                {
                    if (countMAX!==arr_b.length)
                    {
                        this[param] = result_int/divider;
                    }
                    else
                    {
                        this[param] = undefined;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_version(arr_b,param)
    {
        var valid_arr = this.isObject(arr_b) && arr_b.length;
        try
        {
            if(valid_arr)
            {
                var validB1 = this.hex_array[arr_b[1]]!==undefined;
                var validB0 = this.hex_array[arr_b[0]]!==undefined;
                if(validB1&&validB0)
                {
                    this[param] = parseInt(this.hex_array[arr_b[1]])+'.'+parseInt(this.hex_array[arr_b[0]]);
                    return true;
                }
                return false;
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_version_soft_device(arr_b)
    {
        var valid_arr = this.isObject(arr_b) && arr_b.length;
        try
        {
            if(valid_arr)
            {
                var validB1 = this.hex_array[arr_b[1]]!==undefined;
                var validB0 = this.hex_array[arr_b[0]]!==undefined;
                if(validB1&&validB0)
                {
                    this.version_soft_device = parseInt(this.hex_array[arr_b[1]])+'.'+parseInt(this.hex_array[arr_b[0]]);
                    return true;
                }
                return false;
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    // _set_status_electronic_meter(arr_b)
    // {
    //     var valid_arr = this.isObject(arr_b) && arr_b.length;
    //     try
    //     {
    //         if(valid_arr)
    //         {
    //             var validB1 = this.hex_array[arr_b[1]]!==undefined;
    //             var validB0 = this.hex_array[arr_b[0]]!==undefined;
    //             if(validB1&&validB0)
    //             {
    //                 // var sw= parseInt(this.hex_array[2],16).toString(2).split('' ).reverse().splice(0,6);
    //                 // this.version_soft_device = parseInt(this.hex_array[arr_b[1]],16)+'.'+parseInt(this.hex_array[arr_b[0]],16);
    //                 return true;
    //             }
    //         }
    //         else
    //         {
    //             return false;
    //         }
    //     }
    //     catch(e)
    //     {
    //         return false;
    //     }
    // }
    _set_universal_hex(arr_b,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_param)
            {
                // var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    // if (this.hex_array[arr_b[i]]=='ff' ) countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                // if (countMAX!==arr_b.length)
                // {
                    this[param] = result;
                // }
                // else
                // {
                //     this[param] = undefined;
                // }
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    _set_universal_hex2(arr_b,param)
    {
        try
        {
            var valid_arr = this.isObject(arr_b) && arr_b.length;
            var valid_param = typeof param === 'string';
            if (valid_arr&&valid_param)
            {
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                this[param] = result;
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            return false;
        }
    }
    
    _set_universal_boolean(b1,param)
    {
        try
        {
            var res = parseInt(this.hex_array[b1],16);
            if (res===1)
            {
                this[param] = true;
            }
            else
            {
                this[param] = false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_display()
    {
        try
        {
            var display = parseInt(this.hex_array[4],16);
            if (display==1)
            {
                this.state_display = true;
            }
            else
            {
                this.state_display = false;
            }
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    set_package_3()
    {
        //Не используется больше
        return true;
        if (this._set_charge())
        {
            if (this._set_switch_device())
            {
                if (this._set_num_channel())
                {
                    if (this._set_count())
                    {
                         if (this._set_type_archive())
                         {
                             if (this._set_last_time())
                             {
                                this._set_archive();
                                this.comment=JSON.stringify(this);
                             }
                             else
                             {
                                 return false;
                             }
                         }
                         else
                         {
                               return false;
                         }
                    }
                    else
                    {
                         return false;
                    }             
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
           return false;
        }
        return true;
    }
    si_11_package_1()
    {
        if (this._set_charge())
         {
             if (this._set_switch_device())
             {
                 if (this._set_time(3,4,5,6))
                 {
                     if (this._set_temperature(7))
                     {
                          if (this._set_sensors())
                          {
                               this.comment=JSON.stringify(this);
                          }
                          else
                          {
                                return false;
                          }
                     }
                     else
                     {
                          return false;
                     }             
                 }
                 else
                 {
                     return false;
                 }
             }
             else
             {
                 return false;
             }
         }
         else
         {
            return false;
         }
         return true;
    }

    si_21_or_22_package_rev3()
    {
        var res = true;
        res = res && this._set_universal_int( [0],'reason' );
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_time(2,3,4,5);
        res = res && this._set_universal_float_negative( [6,7],10,'temperature' );
        res = res && this._set_sensors(8);
        res = res && this._set_universal_boolean(24,'limit_exceeded' );
        res = res && this._set_universal_int_negative( [25],'min_temperature' );
        res = res && this._set_universal_int_negative( [26],'max_temperature' );
        //24
        return res;
    }
    si_21_or_22_package_1_rev2()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_universal_float_negative( [7,8],10,'temperature' );
        res = res && this._set_sensors(9);
        return res;
    }
    si_21_or_22_package_2_rev2()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_num_channel();
        res = res && this._set_time(4,5,6,7);
        res = res && this._set_sensors();
        return res;
    }
    si_21_or_22_package_85_rev2()
    {
        var res = true;
        if ( this.result === undefined ) this.result = {};
        this.result.count_reboot_power = this._get_universal_int_noFF([0]);
        this.result.count_reboot_soft = this._get_universal_int_noFF([1]);
        this.result.count_reboot_sum = this._get_universal_int_noFF([2]);
        this.result.charge = this._get_universal_int_noFF([3]);
        this.result.count_reboot = this._get_universal_hex_noFF([4]);
        return res;
    }
    si_21_or_22_package_195_rev2()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'reason' );
        res = res && this._set_universal_string_ASCII(2,3,'info_radiomodule');
        res = res && this._set_universal_string_ASCII(4,5,'model');
        res = res && this._set_universal_int( [9,8,7,6],'release_date' );
        res = res && this._set_version( [10,11],'version_module_electronic' );
        res = res && this._set_version( [12,13],'version_soft_device' );
        res = res && this._set_version( [14,15],'version_parameterization' );
        res = res && this._set_universal_int( [16],'charge' );
        res = res && this._set_universal_int( [20,19,18,17],'count_package' );
        return res;
    }


    si_22_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_temperature(7);
        res = res && this._set_sensors();
        return res;
    }
    si_12_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_temperature(7);
        res = res && this._set_sensors();
        return res;
    }
    si_12_package_2()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_num_channel();
        res = res && this._set_time(4,5,6,7);
        res = res && this._set_sensors();
        return res;
    }
    si_22_package_2()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_num_channel();
        res = res && this._set_time(4,5,6,7);
        res = res && this._set_sensors();
        return res;
    }
    si_12_package_4()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_universal_boolean(3,'state_energy' );
        res = res && this._set_time(4,5,6,7);
        return res;
    }
    si_12_package_5()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_switch_device();
        res = res && this._set_status_sensor_out(3,4);
        res = res && this._set_time(5,6,7,8);
        return res;
    }
    sh02_package()
    {
        var res = true;
        res = res && this._set_universal_int( [1], 'reason' );
        res = res && this._set_universal_int( [2], 'charge' );
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_temperature(7);
        if( this.type_package == 1 ) this._set_1wire(8,27);
        if( this.type_package == 9 ) this._set_data_b(8,27);
        res = res && this._set_universal_int( [28,29,30,31],'sensor_1' ); //цифровой
        res = res && this._set_universal_int( [32,33,34,35],'sensor_2' ); //цифровой
        res = res && this._set_universal_int( [36,37],'sensor_3' ); //Аналоговый
        res = res && this._set_universal_int( [38,39],'sensor_4' ); //Аналоговый
        this.sensors.sensor_1=this.sensor_1;
        this.sensors.sensor_2=this.sensor_2;
        this.sensors.sensor_3=this.sensor_3;
        this.sensors.sensor_4=this.sensor_4;
        return res;
    }
    si_13_package_1()
    {
        var res = true;
        res = res && this._set_switch_device();
        res = res && this._set_temperature(7);
        res = res && this._set_universal_int( [8,9,10,11],'sensor_7' );
        res = res && this._set_universal_int( [12,13,14,15],'sensor_8' );
        this.sensors.sensor_7=this.sensor_7;
        this.sensors.sensor_8=this.sensor_8;
        return res;
    }
    si_13rev2_package_1()
    {
        var res = true;
        res = res && this._set_switch_device();
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_temperature(7);
        res = res && this._set_universal_int( [8,9,10,11],'sensor_7' );
        res = res && this._set_universal_int( [12,13,14,15],'sensor_8' );
        this.sensors.sensor_7=this.sensor_7;
        this.sensors.sensor_8=this.sensor_8;
        return res;
    }
    si_13_package_2()
    {
        var res = true;
        res = res && this._set_switch_device();
        res = res && this._set_num_channel();
        res = res && this._set_universal_int( [4,5,6,7],'sensor_7' );
        res = res && this._set_universal_int( [8,9,10,11],'sensor_8' );
        this.sensors.sensor_7=this.sensor_7;
        this.sensors.sensor_8=this.sensor_8;
        return res;
    }
    si_13rev2_package_2()
    {
        var res = true;
        res = res && this._set_switch_device();
        res = res && this._set_num_channel();
        res = res && this._set_universal_int( [4,5,6,7],'sensor_7' );
        res = res && this._set_universal_int( [8,9,10,11],'sensor_8' );
        res = res && this._set_time(12,13,14,15);
        this.sensors.sensor_7=this.sensor_7;
        this.sensors.sensor_8=this.sensor_8;
        return res;
    }
    si_13_package_3()
    {
        var res = true;
        res = res && this._set_universal_int( [1,2],'size_data' );
        res = res && this._set_universal_int( [3],'size_data_package' );
        res = res && this._set_universal_int( [4],'num_package' );
        res = res && this._set_universal_int( [5],'count_package' );
        res = res && this._set_data_b(6);
        return res;
    }
    si_13_package_4()
    {
        var res = true;
        res = res && this._set_universal_hex( [1,2,3,4],'address' );
        res = res && this._set_universal_boolean(5,'result' );
        res = res && this._set_universal_float( [6,7,8,9],1000,'sensor_rate_1' );
        res = res && this._set_universal_float( [10,11,12,13],1000,'sensor_rate_2' );
        res = res && this._set_universal_float( [14,15,16,17],1000,'sensor_rate_3' );
        res = res && this._set_universal_float( [18,19,20,21],1000,'sensor_rate_4' );
        if (!isNaN(this.sensor_rate_1)&&!isNaN(this.sensor_rate_2)&&!isNaN(this.sensor_rate_3)&&!isNaN(this.sensor_rate_4))
        {
            this.sensor_rate_sum = ((this.sensor_rate_1*100)+(this.sensor_rate_2*100)+(this.sensor_rate_3*100)+(this.sensor_rate_4*100))/100;
        }
        return res;
    }
    si_13rev2_package_4()
    {
        var res = true;
        res = res && this._set_universal_hex( [1,2,3,4],'address' );
        res = res && this._set_universal_boolean(5,'result' );
        res = res && this._set_universal_float( [6,7,8,9],1000,'sensor_rate_1' );
        res = res && this._set_universal_float( [10,11,12,13],1000,'sensor_rate_2' );
        res = res && this._set_universal_float( [14,15,16,17],1000,'sensor_rate_3' );
        res = res && this._set_universal_float( [18,19,20,21],1000,'sensor_rate_4' );
        res = res && this._set_time(22,23,24,25);
        if (!isNaN(this.sensor_rate_1)&&!isNaN(this.sensor_rate_2)&&!isNaN(this.sensor_rate_3)&&!isNaN(this.sensor_rate_4))
        {
            this.sensor_rate_sum = ((this.sensor_rate_1*100)+(this.sensor_rate_2*100)+(this.sensor_rate_3*100)+(this.sensor_rate_4*100))/100;
        }
        return res;
    }
    si_13_package_5()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'cmd_code' );
        res = res && this._set_universal_boolean(2,'result' );
        return res;
    }
    si_13rev2_package_6()
    {
        var res = true;
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_data_b(5);
        this.data_b = this.data_b.reverse();
        this.address = this.data_b[0];
        return res;
    }
    package_correction_time()
    {
        var res = true;
        res = res && this._set_time(1,2,3,4);
        return res;
    }
    package_settings()
    {
        var res = true;
        return res;
    }
    spbzip_package_1()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_model();
        res = res && this._set_count_phase(10);
        res = res && this._set_count_rate();
        // res = res && this._set_relay_state();
        res = res && this._set_release_date();
        res = res && this._set_version_soft();
        // res = res && this._set_kt();
        res = res && this._set_universal_float_noFF( [21,22,23,24],1000,'sensor_rate_sum' );
        res = res && this._set_temperature(25);
        res = res && this._set_state([26,27,28,29]);
        res = res && this._set_universal_int( [30,31],'event' );
        res = res && this._set_universal_hex2( [32,33],'UUID' );
        return res;
    }
    spbzip_package_2()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_universal_float_noFF( [9,10],100,'voltage_A' );
        res = res && this._set_universal_float_noFF( [11,12],100,'voltage_B' );
        res = res && this._set_universal_float_noFF( [13,14],100,'voltage_C' );
        res = res && this._set_universal_float_noFF( [15,16,17,18],1000,'electric_current_A' );
        res = res && this._set_universal_float_noFF( [19,20,21,22],1000,'electric_current_B' );
        res = res && this._set_universal_float_noFF( [23,24,25,26],1000,'electric_current_C' );
        res = res && this._set_universal_float_noFF( [27,28],1000,'power_factor_A' );
        res = res && this._set_universal_float_noFF( [29,30],1000,'power_factor_B' );
        res = res && this._set_universal_float_noFF( [31,32],1000,'power_factor_C' );
        res = res && this._set_universal_float_noFF( [33,34],1000,'power_factor_summary' );
        res = res && this._set_universal_float_noFF( [35,36],100,'frequency_network' );
        res = res && this._set_universal_int_noFF( [37,38,39,40],'total_power_summary' );
        res = res && this._set_universal_hex2( [41,42],'UUID' );
        return res;
    }
    spbzip_package_3()
    {
        var res = true;
        res = res && this._set_size_package_in();
        res = res && this._set_size_package_out();
        res = res && this._set_num_out();
        res = res && this._set_count_package();
        res = res && this._set_data_b(6);
        return res;
    }
    spbzip_package_4()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        // res = res && this._set_count_rate_active();
        res = res && this._set_rate_active(9);
        // res = res && this._set_universal_float( [11,12],100,'kt' );
        res = res && this._set_universal_float_noFF( [10,11,12,13],1000,'sensor_rate_sum' );
        res = res && this._set_universal_float_noFF( [14,15,16,17],1000,'sensor_rate_1' );
        res = res && this._set_universal_float_noFF( [18,19,20,21],1000,'sensor_rate_2' );
        res = res && this._set_universal_float_noFF( [22,23,24,25],1000,'sensor_rate_3' );
        res = res && this._set_universal_float_noFF( [26,27,28,29],1000,'sensor_rate_4' );
        res = res && this._set_universal_hex2( [30,31],'UUID' );
        return res;
    }
    spbzip_package_5()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_universal_int( [5,6,7,8],'date_1' );
        res = res && this._set_universal_int( [9],'note_1' );
        res = res && this._set_universal_int_noFF( [10,11,12,13],'A_p_1' );
        res = res && this._set_universal_int( [14,15,16,17],'date_2' );
        res = res && this._set_universal_int( [18],'note_2' );
        res = res && this._set_universal_int_noFF( [19,20,21,22],'A_p_2' );
        res = res && this._set_universal_hex2( [23,24],'UUID' );
        return res;
    }
    spbzip_package_6()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_universal_int_noFF( [5],'result' );
        res = res && this._set_universal_hex2( [6,7],'UUID' );
        return res;
    }
    spbzip_package_7()
    {
        var res = true;
        res = res && this._set_universal_int_noFF( [1,2,3,4],'network_address' );
        res = res && this._set_universal_int_negative( [5,6],'time_zone' );
        res = res && this._set_universal_int_noFF( [7],'period_reconnection_h' );
        res = res && this._set_universal_int_noFF( [8],'flag_event' );
        res = res && this._set_universal_int_noFF( [9],'flag_helf_hour' );
        res = res && this._set_universal_int_noFF( [10],'flag_ack' );
        res = res && this._set_universal_float_noFF( [11,12,13,14],10,'limit_power' );
        // res = res && this._set_universal_int_noFF( [15,16,17,18],'limit_energy' );

        res = res && this._set_universal_int_noFF( [19],'accumulation_period_info' );
        res = res && this._set_universal_int_noFF( [20],'accumulation_period_day_info' );
        res = res && this._set_universal_int_noFF( [21],'accumulation_period_month_info' );

        res = res && this._set_universal_int_noFF( [22],'accumulation_period_readings' );
        res = res && this._set_universal_int_noFF( [23],'accumulation_period_day_readings' );
        res = res && this._set_universal_int_noFF( [24],'accumulation_period_month_readings' );

        res = res && this._set_universal_int_noFF( [25],'accumulation_period_instant' );
        res = res && this._set_universal_int_noFF( [26],'accumulation_period_day_instant' );
        res = res && this._set_universal_int_noFF( [27],'accumulation_period_month_instant' );

        res = res && this._set_universal_hex2( [28,29],'UUID' );

        return res;
    }
    spbzip_package_8()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'tariff_schedule_season_number' );
        res = res && this._set_universal_int_noFF( [2],'tariff_schedule_code' );

        res = res && this._set_universal_int_noFF( [3],'tariff_schedule_minute_end_1_zone' );
        res = res && this._set_universal_int_noFF( [4],'tariff_schedule_hour_end_1_zone' );
        res = res && this._set_universal_int_noFF( [5],'tariff_schedule_number_1_zone' );

        res = res && this._set_universal_int_noFF( [6],'tariff_schedule_minute_end_2_zone' );
        res = res && this._set_universal_int_noFF( [7],'tariff_schedule_hour_end_2_zone' );
        res = res && this._set_universal_int_noFF( [8],'tariff_schedule_number_2_zone' );

        res = res && this._set_universal_int_noFF( [9],'tariff_schedule_minute_end_3_zone' );
        res = res && this._set_universal_int_noFF( [10],'tariff_schedule_hour_end_3_zone' );
        res = res && this._set_universal_int_noFF( [11],'tariff_schedule_number_3_zone' );

        res = res && this._set_universal_int_noFF( [12],'tariff_schedule_minute_end_4_zone' );
        res = res && this._set_universal_int_noFF( [13],'tariff_schedule_hour_end_4_zone' );
        res = res && this._set_universal_int_noFF( [14],'tariff_schedule_number_4_zone' );

        res = res && this._set_universal_int_noFF( [15],'tariff_schedule_minute_end_5_zone' );
        res = res && this._set_universal_int_noFF( [16],'tariff_schedule_hour_end_5_zone' );
        res = res && this._set_universal_int_noFF( [17],'tariff_schedule_number_5_zone' );

        res = res && this._set_universal_int_noFF( [18],'tariff_schedule_minute_end_6_zone' );
        res = res && this._set_universal_int_noFF( [19],'tariff_schedule_hour_end_6_zone' );
        res = res && this._set_universal_int_noFF( [20],'tariff_schedule_number_6_zone' );

        res = res && this._set_universal_int_noFF( [21],'tariff_schedule_minute_end_7_zone' );
        res = res && this._set_universal_int_noFF( [22],'tariff_schedule_hour_end_7_zone' );
        res = res && this._set_universal_int_noFF( [23],'tariff_schedule_number_7_zone' );

        res = res && this._set_universal_int_noFF( [24],'tariff_schedule_minute_end_8_zone' );
        res = res && this._set_universal_int_noFF( [25],'tariff_schedule_hour_end_8_zone' );
        res = res && this._set_universal_int_noFF( [26],'tariff_schedule_number_8_zone' );

        res = res && this._set_universal_int_noFF( [27],'tariff_schedule_minute_end_9_zone' );
        res = res && this._set_universal_int_noFF( [28],'tariff_schedule_hour_end_9_zone' );
        res = res && this._set_universal_int_noFF( [29],'tariff_schedule_number_9_zone' );

        res = res && this._set_universal_int_noFF( [30],'tariff_schedule_minute_end_10_zone' );
        res = res && this._set_universal_int_noFF( [31],'tariff_schedule_hour_end_10_zone' );
        res = res && this._set_universal_int_noFF( [32],'tariff_schedule_number_10_zone' );

        res = res && this._set_universal_int_noFF( [33],'tariff_schedule_minute_end_11_zone' );
        res = res && this._set_universal_int_noFF( [34],'tariff_schedule_hour_end_11_zone' );
        res = res && this._set_universal_int_noFF( [35],'tariff_schedule_number_11_zone' );

        res = res && this._set_universal_int_noFF( [36],'tariff_schedule_minute_end_12_zone' );
        res = res && this._set_universal_int_noFF( [37],'tariff_schedule_hour_end_12_zone' );
        res = res && this._set_universal_int_noFF( [38],'tariff_schedule_number_12_zone' );

        res = res && this._set_universal_int_noFF( [39],'tariff_schedule_minute_end_13_zone' );
        res = res && this._set_universal_int_noFF( [40],'tariff_schedule_hour_end_13_zone' );
        res = res && this._set_universal_int_noFF( [41],'tariff_schedule_number_13_zone' );

        res = res && this._set_universal_int_noFF( [42],'tariff_schedule_minute_end_14_zone' );
        res = res && this._set_universal_int_noFF( [43],'tariff_schedule_hour_end_14_zone' );
        res = res && this._set_universal_int_noFF( [44],'tariff_schedule_number_14_zone' );

        res = res && this._set_universal_int_noFF( [45],'tariff_schedule_minute_end_15_zone' );
        res = res && this._set_universal_int_noFF( [46],'tariff_schedule_hour_end_15_zone' );
        res = res && this._set_universal_int_noFF( [47],'tariff_schedule_number_15_zone' );

        res = res && this._set_universal_hex2( [48,49],'UUID' );

        return res;
    }
    spbzip_package_9()
    {
        var res = true;

        res = res && this._set_time(1,2,3,4);
        res = res && this._set_version_soft_device( [5,6] );
        res = res && this._set_release_date(7,8,9,10);
        // res = res && this._set_serial(11,12,13,14);
        res = res && this._set_universal_int_noFF( [11,12,13,14],'serial' );
        res = res && this._set_universal_int_noFF( [15,16,17,18],'network_address' );
        res = res && this._set_universal_string_ASCII(19,34,'location_description');
        res = res && this._set_universal_int_noFF( [35],'version_module_electronic' );
        res = res && this._set_universal_hex2( [36],'version_parameterization' );
        res = res && this._set_universal_hex2( [37,38,39],'info_radiomodule' );
        res = res && this._set_universal_float_noFF( [40,41],100,'nomenal_voltage' );
        res = res && this._set_universal_int_noFF( [42],'nomenal_current' );
        res = res && this._set_universal_int_noFF( [43],'maximal_current' );
        res = res && this._set_universal_int_noFF( [44],'code_model' );

        // res = res && this._set_universal_int_noFF( [7,8],'code_error_1' );
        // res = res && this._set_universal_int_noFF( [9,10],'code_error_2' );
        // res = res && this._set_universal_int_noFF( [11,12],'code_error_3' );
        // res = res && this._set_universal_hex( [13,14,15,16],'diagnostic_codes' );
        // res = res && this._set_universal_hex( [20,19,18,17],'serial' );
        // res = res && this._set_universal_int_noFF( [21,22,23,24],'network_address' );
        // res = res && this._set_universal_string_ASCII(25,40,'location_description');
        // res = res && this._set_universal_int_noFF( [41],'version_module_electronic' );
        // res = res && this._set_universal_int_noFF( [42],'version_parameterization' );
        // // res = res && this._set_status_electronic_meter( [43,44] );
        // res = res && this._set_universal_int_noFF( [45],'flag_relay' );
        // res = res && this._set_universal_int_noFF( [46],'flag_state_relay' );
        // res = res && this._set_universal_int_noFF( [47],'flag_translation_time' );

        res = res && this._set_universal_hex2( [45,46],'UUID' );

        return res;
    }
    spbzip_package_10()
    {
        var res = true;

        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_hex2( [5,6],'code_error_1' );
        res = res && this._set_universal_hex2( [7,8],'code_error_2' );
        res = res && this._set_universal_hex2( [9,10],'code_error_3' );
        res = res && this._set_universal_hex2( [11,12],'code_error_4' );
        res = res && this._set_universal_hex2( [13,14],'code_error_5' );
        res = res && this._set_universal_hex2( [15,16,17,18],'diagnostic_codes' );
        res = res && this._set_universal_hex2( [19,20],'status_state' );
        res = res && this._set_universal_int_noFF( [21],'flag_relay' );
        res = res && this._set_universal_int_noFF( [22],'flag_state_relay' );
        res = res && this._set_universal_int_noFF( [23],'flag_translation_time' );

        res = res && this._set_universal_hex2( [24,25],'UUID' );

        return res;
    }
    spbzip_package_11()
    {
        var res = true;

        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_float_noFF( [5,6,7,8],10,'limit_active_power' );
        res = res && this._set_universal_int_noFF( [9],'time_minute_averages_power' );
        res = res && this._set_universal_hex2( [10],'mode_measuring_power' );

        res = res && this._set_universal_hex2( [11,12],'UUID' );
        return res;
    }
    spbzip_package_12()
    {
        var res = true;

        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_float_noFF( [5,6,7,8],10,'limit_active_power' );
        res = res && this._set_universal_int_noFF( [9],'time_minute_averages_power' );
        res = res && this._set_universal_hex2( [10],'mode_measuring_power' );

        res = res && this._set_universal_int_noFF( [11],'time_minute_delay_automatic_switching_relay' );
        res = res && this._set_universal_int_noFF( [12],'count_automatic_switching_relay' );

        res = res && this._set_universal_hex2( [13,14],'UUID' );

        return res;
    }
    spbzip_package_13()
    {
        var res = true;

        res = res && this._set_time(1,2,3,4);

        res = res && this._set_universal_int_noFF( [5],'code_page_indication_1' );
        res = res && this._set_universal_int_noFF( [6],'time_seconds_show_page_indication_1' );
        res = res && this._set_universal_int_noFF( [7],'code_page_indication_2' );
        res = res && this._set_universal_int_noFF( [8],'time_seconds_show_page_indication_2' );
        res = res && this._set_universal_int_noFF( [9],'code_page_indication_3' );
        res = res && this._set_universal_int_noFF( [10],'time_seconds_show_page_indication_3' );
        res = res && this._set_universal_int_noFF( [11],'code_page_indication_4' );
        res = res && this._set_universal_int_noFF( [12],'time_seconds_show_page_indication_4' );
        res = res && this._set_universal_int_noFF( [13],'code_page_indication_5' );
        res = res && this._set_universal_int_noFF( [14],'time_seconds_show_page_indication_5' );
        res = res && this._set_universal_int_noFF( [15],'code_page_indication_6' );
        res = res && this._set_universal_int_noFF( [16],'time_seconds_show_page_indication_6' );
        res = res && this._set_universal_int_noFF( [17],'code_page_indication_7' );
        res = res && this._set_universal_int_noFF( [18],'time_seconds_show_page_indication_7' );
        res = res && this._set_universal_int_noFF( [19],'code_page_indication_8' );
        res = res && this._set_universal_int_noFF( [20],'time_seconds_show_page_indication_8' );
        res = res && this._set_universal_int_noFF( [21],'code_page_indication_9' );
        res = res && this._set_universal_int_noFF( [22],'time_seconds_show_page_indication_9' );
        res = res && this._set_universal_int_noFF( [23],'code_page_indication_10' );
        res = res && this._set_universal_int_noFF( [24],'time_seconds_show_page_indication_10' );
        res = res && this._set_universal_int_noFF( [25],'code_page_indication_11' );
        res = res && this._set_universal_int_noFF( [26],'time_seconds_show_page_indication_11' );
        res = res && this._set_universal_int_noFF( [27],'code_page_indication_12' );
        res = res && this._set_universal_int_noFF( [28],'time_seconds_show_page_indication_12' );
        res = res && this._set_universal_int_noFF( [29],'code_page_indication_13' );
        res = res && this._set_universal_int_noFF( [30],'time_seconds_show_page_indication_13' );
        res = res && this._set_universal_int_noFF( [31],'code_page_indication_14' );
        res = res && this._set_universal_int_noFF( [32],'time_seconds_show_page_indication_14' );
        res = res && this._set_universal_int_noFF( [33],'code_page_indication_15' );
        res = res && this._set_universal_int_noFF( [34],'time_seconds_show_page_indication_15' );

        res = res && this._set_universal_hex2( [35,36],'UUID' );

        return res;
    }
    
    spbzip_package_14()
    {
        var res = true;

        res = res && this._set_time(1,2,3,4);

        res = res && this._set_universal_int_noFF( [5],'code_page_indication_16' );
        res = res && this._set_universal_int_noFF( [6],'time_seconds_show_page_indication_16' );
        res = res && this._set_universal_int_noFF( [7],'code_page_indication_17' );
        res = res && this._set_universal_int_noFF( [8],'time_seconds_show_page_indication_17' );
        res = res && this._set_universal_int_noFF( [9],'code_page_indication_18' );
        res = res && this._set_universal_int_noFF( [10],'time_seconds_show_page_indication_18' );
        res = res && this._set_universal_int_noFF( [11],'code_page_indication_19' );
        res = res && this._set_universal_int_noFF( [12],'time_seconds_show_page_indication_19' );
        res = res && this._set_universal_int_noFF( [13],'code_page_indication_20' );
        res = res && this._set_universal_int_noFF( [14],'time_seconds_show_page_indication_20' );
        res = res && this._set_universal_int_noFF( [15],'code_page_indication_21' );
        res = res && this._set_universal_int_noFF( [16],'time_seconds_show_page_indication_21' );
        res = res && this._set_universal_int_noFF( [17],'code_page_indication_22' );
        res = res && this._set_universal_int_noFF( [18],'time_seconds_show_page_indication_22' );
        res = res && this._set_universal_int_noFF( [19],'code_page_indication_23' );
        res = res && this._set_universal_int_noFF( [20],'time_seconds_show_page_indication_23' );
        res = res && this._set_universal_int_noFF( [21],'code_page_indication_24' );
        res = res && this._set_universal_int_noFF( [22],'time_seconds_show_page_indication_24' );
        res = res && this._set_universal_int_noFF( [23],'code_page_indication_25' );
        res = res && this._set_universal_int_noFF( [24],'time_seconds_show_page_indication_25' );
        res = res && this._set_universal_int_noFF( [25],'code_page_indication_26' );
        res = res && this._set_universal_int_noFF( [26],'time_seconds_show_page_indication_26' );
        res = res && this._set_universal_int_noFF( [27],'code_page_indication_27' );
        res = res && this._set_universal_int_noFF( [28],'time_seconds_show_page_indication_27' );
        res = res && this._set_universal_int_noFF( [29],'code_page_indication_28' );
        res = res && this._set_universal_int_noFF( [30],'time_seconds_show_page_indication_28' );
        res = res && this._set_universal_int_noFF( [31],'code_page_indication_29' );
        res = res && this._set_universal_int_noFF( [32],'time_seconds_show_page_indication_29' );
        res = res && this._set_universal_int_noFF( [33],'code_page_indication_30' );
        res = res && this._set_universal_int_noFF( [34],'time_seconds_show_page_indication_30' );
        res = res && this._set_universal_int_noFF( [35],'code_page_indication_31' );
        res = res && this._set_universal_int_noFF( [36],'time_seconds_show_page_indication_31' );

        res = res && this._set_universal_hex2( [37,38],'UUID' );

        return res;
    }

    spbzip_package_15()
    {
        var res = true;

        res = res && this._set_universal_int( [1],'special_day_d_1' );
        res = res && this._set_universal_int( [2],'special_day_m_1' );
        res = res && this._set_universal_int( [3],'special_day_t_1' );
        res = res && this._set_universal_int( [4],'special_day_d_2' );
        res = res && this._set_universal_int( [5],'special_day_m_2' );
        res = res && this._set_universal_int( [6],'special_day_t_2' );
        res = res && this._set_universal_int( [7],'special_day_d_3' );
        res = res && this._set_universal_int( [8],'special_day_m_3' );
        res = res && this._set_universal_int( [9],'special_day_t_3' );
        res = res && this._set_universal_int( [10],'special_day_d_4' );
        res = res && this._set_universal_int( [11],'special_day_m_4' );
        res = res && this._set_universal_int( [12],'special_day_t_4' );
        res = res && this._set_universal_int( [13],'special_day_d_5' );
        res = res && this._set_universal_int( [14],'special_day_m_5' );
        res = res && this._set_universal_int( [15],'special_day_t_5' );
        res = res && this._set_universal_int( [16],'special_day_d_6' );
        res = res && this._set_universal_int( [17],'special_day_m_6' );
        res = res && this._set_universal_int( [18],'special_day_t_6' );
        res = res && this._set_universal_int( [19],'special_day_d_7' );
        res = res && this._set_universal_int( [20],'special_day_m_7' );
        res = res && this._set_universal_int( [21],'special_day_t_7' );
        res = res && this._set_universal_int( [22],'special_day_d_8' );
        res = res && this._set_universal_int( [23],'special_day_m_8' );
        res = res && this._set_universal_int( [24],'special_day_t_8' );
        res = res && this._set_universal_int( [25],'special_day_d_9' );
        res = res && this._set_universal_int( [26],'special_day_m_9' );
        res = res && this._set_universal_int( [27],'special_day_t_9' );
        res = res && this._set_universal_int( [28],'special_day_d_10' );
        res = res && this._set_universal_int( [29],'special_day_m_10' );
        res = res && this._set_universal_int( [30],'special_day_t_10' );
        res = res && this._set_universal_int( [31],'special_day_d_11' );
        res = res && this._set_universal_int( [32],'special_day_m_11' );
        res = res && this._set_universal_int( [33],'special_day_t_11' );
        res = res && this._set_universal_int( [34],'special_day_d_12' );
        res = res && this._set_universal_int( [35],'special_day_m_12' );
        res = res && this._set_universal_int( [36],'special_day_t_12' );
        res = res && this._set_universal_int( [37],'special_day_d_13' );
        res = res && this._set_universal_int( [38],'special_day_m_13' );
        res = res && this._set_universal_int( [39],'special_day_t_13' );
        res = res && this._set_universal_int( [40],'special_day_d_14' );
        res = res && this._set_universal_int( [41],'special_day_m_14' );
        res = res && this._set_universal_int( [42],'special_day_t_14' );
        res = res && this._set_universal_int( [43],'special_day_d_15' );
        res = res && this._set_universal_int( [44],'special_day_m_15' );
        res = res && this._set_universal_int( [45],'special_day_t_15' );
        res = res && this._set_universal_int( [46],'special_day_d_16' );
        res = res && this._set_universal_int( [47],'special_day_m_16' );
        res = res && this._set_universal_int( [48],'special_day_t_16' );

        res = res && this._set_universal_hex2( [49,50],'UUID' );

        return res;
    }

    spbzip_package_16()
    {
        var res = true;
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_int_noFF( [5],'selected_m_archive' );
        res = res && this._set_universal_int_noFF( [6],'selected_y_archive' );
        res = res && this._set_universal_int_noFF( [7,8,9,10],'cumulative_energy_summary' );
        res = res && this._set_universal_int_noFF( [11,12,13,14],'cumulative_energy_rate_1' );
        res = res && this._set_universal_int_noFF( [15,16,17,18],'cumulative_energy_rate_2' );
        res = res && this._set_universal_int_noFF( [19,20,21,22],'cumulative_energy_rate_3' );
        res = res && this._set_universal_int_noFF( [23,25,25,26],'cumulative_energy_rate_4' );
        
        res = res && this._set_universal_hex2( [27,28],'UUID' );

        return res;
    }

    spbzip_package_17()
    {
        var res = true;
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_int_noFF( [5],'selected_d_archive' );
        res = res && this._set_universal_int_noFF( [6],'selected_m_archive' );
        res = res && this._set_universal_int_noFF( [7],'selected_y_archive' );
        res = res && this._set_universal_int_noFF( [8,9,10,11],'cumulative_energy_summary' );
        res = res && this._set_universal_int_noFF( [12,13,14,15],'cumulative_energy_rate_1' );
        res = res && this._set_universal_int_noFF( [16,17,18,19],'cumulative_energy_rate_2' );
        res = res && this._set_universal_int_noFF( [20,21,22,23],'cumulative_energy_rate_3' );
        res = res && this._set_universal_int_noFF( [24,25,26,27],'cumulative_energy_rate_4' );

        res = res && this._set_universal_hex2( [28,29],'UUID' );

        return res;
    }

    spbzip_package_18()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        res = res && this._set_universal_int_noFF( [2,3,4,5],'selected_date' );
        if(this.num_package && this.selected_date)
        {
            if( typeof this.half_hour_slices_active_power !== 'object' ) this.half_hour_slices_active_power = [];
            if(this.num_package == 1)
            {
                this.half_hour_slices_active_power.push({
                    date_begin: moment.unix(this.selected_date).utc().hour(0).minute(0).unix(),
                    status: this._get_universal_int_noFF([6]),
                    active_power: this._get_universal_int_noFF([7,8])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(0).minute(30).unix(),
                    status: this._get_universal_int_noFF([9]),
                    active_power: this._get_universal_int_noFF([10,11])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(1).minute(0).unix(),
                    status: this._get_universal_int_noFF([12]),
                    active_power: this._get_universal_int_noFF([13,14])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(1).minute(30).unix(),
                    status: this._get_universal_int_noFF([15]),
                    active_power: this._get_universal_int_noFF([16,17])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(2).minute(0).unix(),
                    status: this._get_universal_int_noFF([18]),
                    active_power: this._get_universal_int_noFF([19,20])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(2).minute(30).unix(),
                    status: this._get_universal_int_noFF([21]),
                    active_power: this._get_universal_int_noFF([22,23])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(3).minute(0).unix(),
                    status: this._get_universal_int_noFF([24]),
                    active_power: this._get_universal_int_noFF([25,26])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(3).minute(30).unix(),
                    status: this._get_universal_int_noFF([27]),
                    active_power: this._get_universal_int_noFF([28,29])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(4).minute(0).unix(),
                    status: this._get_universal_int_noFF([30]),
                    active_power: this._get_universal_int_noFF([31,32])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(4).minute(30).unix(),
                    status: this._get_universal_int_noFF([33]),
                    active_power: this._get_universal_int_noFF([34,35])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(5).minute(0).unix(),
                    status: this._get_universal_int_noFF([36]),
                    active_power: this._get_universal_int_noFF([37,38])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(5).minute(30).unix(),
                    status: this._get_universal_int_noFF([39]),
                    active_power: this._get_universal_int_noFF([40,41])
                });
                res = res && this._set_universal_hex2( [42,43],'UUID' );
            }
            else if(this.num_package == 2)
            {
                this.half_hour_slices_active_power.push({
                    date_begin: moment.unix(this.selected_date).utc().hour(6).minute(0).unix(),
                    status: this._get_universal_int_noFF([6]),
                    active_power: this._get_universal_int_noFF([7,8])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(6).minute(30).unix(),
                    status: this._get_universal_int_noFF([9]),
                    active_power: this._get_universal_int_noFF([10,11])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(7).minute(0).unix(),
                    status: this._get_universal_int_noFF([12]),
                    active_power: this._get_universal_int_noFF([13,14])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(7).minute(30).unix(),
                    status: this._get_universal_int_noFF([15]),
                    active_power: this._get_universal_int_noFF([16,17])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(8).minute(0).unix(),
                    status: this._get_universal_int_noFF([18]),
                    active_power: this._get_universal_int_noFF([19,20])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(8).minute(30).unix(),
                    status: this._get_universal_int_noFF([21]),
                    active_power: this._get_universal_int_noFF([22,23])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(9).minute(0).unix(),
                    status: this._get_universal_int_noFF([24]),
                    active_power: this._get_universal_int_noFF([25,26])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(9).minute(30).unix(),
                    status: this._get_universal_int_noFF([27]),
                    active_power: this._get_universal_int_noFF([28,29])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(10).minute(0).unix(),
                    status: this._get_universal_int_noFF([30]),
                    active_power: this._get_universal_int_noFF([31,32])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(10).minute(30).unix(),
                    status: this._get_universal_int_noFF([33]),
                    active_power: this._get_universal_int_noFF([34,35])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(11).minute(0).unix(),
                    status: this._get_universal_int_noFF([36]),
                    active_power: this._get_universal_int_noFF([37,38])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(11).minute(30).unix(),
                    status: this._get_universal_int_noFF([39]),
                    active_power: this._get_universal_int_noFF([40,41])
                });
                res = res && this._set_universal_hex2( [42,43],'UUID' );
            }
            else if(this.num_package == 3)
            {
                this.half_hour_slices_active_power.push({
                    date_begin: moment.unix(this.selected_date).utc().hour(12).minute(0).unix(),
                    status: this._get_universal_int_noFF([6]),
                    active_power: this._get_universal_int_noFF([7,8])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(12).minute(30).unix(),
                    status: this._get_universal_int_noFF([9]),
                    active_power: this._get_universal_int_noFF([10,11])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(13).minute(0).unix(),
                    status: this._get_universal_int_noFF([12]),
                    active_power: this._get_universal_int_noFF([13,14])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(13).minute(30).unix(),
                    status: this._get_universal_int_noFF([15]),
                    active_power: this._get_universal_int_noFF([16,17])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(14).minute(0).unix(),
                    status: this._get_universal_int_noFF([18]),
                    active_power: this._get_universal_int_noFF([19,20])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(14).minute(30).unix(),
                    status: this._get_universal_int_noFF([21]),
                    active_power: this._get_universal_int_noFF([22,23])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(15).minute(0).unix(),
                    status: this._get_universal_int_noFF([24]),
                    active_power: this._get_universal_int_noFF([25,26])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(15).minute(30).unix(),
                    status: this._get_universal_int_noFF([27]),
                    active_power: this._get_universal_int_noFF([28,29])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(16).minute(0).unix(),
                    status: this._get_universal_int_noFF([30]),
                    active_power: this._get_universal_int_noFF([31,32])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(16).minute(30).unix(),
                    status: this._get_universal_int_noFF([33]),
                    active_power: this._get_universal_int_noFF([34,35])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(17).minute(0).unix(),
                    status: this._get_universal_int_noFF([36]),
                    active_power: this._get_universal_int_noFF([37,38])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(17).minute(30).unix(),
                    status: this._get_universal_int_noFF([39]),
                    active_power: this._get_universal_int_noFF([40,41])
                });
                res = res && this._set_universal_hex2( [42,43],'UUID' );
            }
            else if(this.num_package == 4)
            {
                this.half_hour_slices_active_power.push({
                    date_begin: moment.unix(this.selected_date).utc().hour(18).minute(0).unix(),
                    status: this._get_universal_int_noFF([6]),
                    active_power: this._get_universal_int_noFF([7,8])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(18).minute(30).unix(),
                    status: this._get_universal_int_noFF([9]),
                    active_power: this._get_universal_int_noFF([10,11])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(19).minute(0).unix(),
                    status: this._get_universal_int_noFF([12]),
                    active_power: this._get_universal_int_noFF([13,14])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(19).minute(30).unix(),
                    status: this._get_universal_int_noFF([15]),
                    active_power: this._get_universal_int_noFF([16,17])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(20).minute(0).unix(),
                    status: this._get_universal_int_noFF([18]),
                    active_power: this._get_universal_int_noFF([19,20])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(20).minute(30).unix(),
                    status: this._get_universal_int_noFF([21]),
                    active_power: this._get_universal_int_noFF([22,23])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(21).minute(0).unix(),
                    status: this._get_universal_int_noFF([24]),
                    active_power: this._get_universal_int_noFF([25,26])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(21).minute(30).unix(),
                    status: this._get_universal_int_noFF([27]),
                    active_power: this._get_universal_int_noFF([28,29])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(22).minute(0).unix(),
                    status: this._get_universal_int_noFF([30]),
                    active_power: this._get_universal_int_noFF([31,32])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(22).minute(30).unix(),
                    status: this._get_universal_int_noFF([33]),
                    active_power: this._get_universal_int_noFF([34,35])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(23).minute(0).unix(),
                    status: this._get_universal_int_noFF([36]),
                    active_power: this._get_universal_int_noFF([37,38])
                });
                this.half_hour_slices_active_power.push({
                    date_begin:moment.unix(this.selected_date).utc().hour(23).minute(30).unix(),
                    status: this._get_universal_int_noFF([39]),
                    active_power: this._get_universal_int_noFF([40,41])
                });
                res = res && this._set_universal_hex2( [42,43],'UUID' );
            }
        }

        return res;
    }

    spbzip_package_19()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 4; i++)
        {
            this.journal.push({
                date_begin: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                date_end: this._get_universal_int_noFF([currentByte+4,currentByte+5,currentByte+6,currentByte+7]),
                code: this._get_universal_hex_noFF([currentByte+8]),
                service_info: this._get_universal_hex_noFF([currentByte+9])
            });
            currentByte = currentByte+10;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );
        return res;
    }

    spbzip_package_20()
    {
        var res = true;
        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 3; i++)
        {
            this.journal.push({
                date_begin: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                date_end: this._get_universal_int_noFF([currentByte+4,currentByte+5,currentByte+6,currentByte+7]),
                service_info: this._get_universal_hex_noFF([currentByte+8]),
                max_value:this._get_universal_float_noFF([currentByte+9,currentByte+10],100),
                max_deviation:this._get_universal_float_negative_noFF([currentByte+11,currentByte+12],100)
            });
            currentByte = currentByte+13;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );
        return res;
    }

    spbzip_package_21()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 3; i++)
        {
            this.journal.push({
                service_info: this._get_universal_hex_noFF([currentByte]),
                date_begin: this._get_universal_int_noFF([currentByte+1,currentByte+2,currentByte+3,currentByte+4]),
                date_end: this._get_universal_int_noFF([currentByte+5,currentByte+6,currentByte+7,currentByte+8]),
                number_phase_deviation:this._get_number_phase(currentByte+9),
                max_value:this._get_universal_float_noFF([currentByte+10,currentByte+11],100),
                max_deviation:this._get_universal_float_negative_noFF([currentByte+12,currentByte+13],100)
            });
            var lastItemJournal = this.journal[this.journal.length-1];
            if( lastItemJournal.date_begin === undefined ) lastItemJournal.number_phase_deviation.status_parse = false;
            currentByte = currentByte+14;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );
        return res;
    }

    spbzip_package_22()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 3; i++)
        {
            this.journal.push({
                service_info: this._get_universal_hex_noFF([currentByte]),
                date_begin: this._get_universal_int_noFF([currentByte+1,currentByte+2,currentByte+3,currentByte+4]),
                date_end: this._get_universal_int_noFF([currentByte+5,currentByte+6,currentByte+7,currentByte+8]),
                number_phase_deviation:this._get_number_phase(currentByte+9),
                max_value:this._get_universal_float_noFF([currentByte+10,currentByte+11],100),
                max_deviation:this._get_universal_float_negative_noFF([currentByte+12,currentByte+13],100)
            });
            var lastItemJournal = this.journal[this.journal.length-1];
            if( lastItemJournal.date_begin === undefined ) lastItemJournal.number_phase_deviation.status_parse = false;
            currentByte = currentByte+14;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );
        return res;
    }

    spbzip_package_23()
    {
        var res = true;
        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 3; i++)
        {
            this.journal.push({
                service_info: this._get_universal_hex_noFF([currentByte]),
                date_begin: this._get_universal_int_noFF([currentByte+1,currentByte+2,currentByte+3,currentByte+4]),
                date_end: this._get_universal_int_noFF([currentByte+5,currentByte+6,currentByte+7,currentByte+8]),
                number_phase_deviation:this._get_number_phase(currentByte+9),
                max_value:this._get_universal_float_noFF([currentByte+10,currentByte+11],100),
                max_deviation:this._get_universal_float_negative_noFF([currentByte+12,currentByte+13],100)
            });
            var lastItemJournal = this.journal[this.journal.length-1];
            if( lastItemJournal.date_begin === undefined ) lastItemJournal.number_phase_deviation.status_parse = false;
            currentByte = currentByte+14;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );
        return res;
    }

    spbzip_package_24()
    {
        var res = true;
        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 8; i++)
        {
            this.journal.push({
                date_begin: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                byte_state: this._get_byte_state(currentByte+4)
            });
            currentByte = currentByte+5;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }

    spbzip_package_25()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 8; i++)
        {
            this.journal.push({
                date: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3])
            });
            currentByte = currentByte+4;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }

    spbzip_package_26()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 4; i++)
        {
            this.journal.push({
                date_begin: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                date_end: this._get_universal_int_noFF([currentByte+4,currentByte+5,currentByte+6,currentByte+7]),
                code: this._get_universal_hex_noFF([currentByte+8])
            });
            currentByte = currentByte+9;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }

    spbzip_package_27()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 4; i++)
        {
            this.journal.push({
                date: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                code: this._get_universal_hex_noFF([currentByte+4]),
                value: this._get_universal_int_negative_noFF([currentByte+5])
            });
            currentByte = currentByte+6;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }

    spbzip_package_28()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 8; i++)
        {
            this.journal.push({
                date: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                code: this._get_universal_hex_noFF([currentByte+4])
            });
            currentByte = currentByte+5;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }

    spbzip_package_29()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 4; i++)
        {
            this.journal.push({
                date: this._get_universal_int_noFF([currentByte,currentByte+1,currentByte+2,currentByte+3]),
                code: this._get_universal_hex_noFF([currentByte+4]),
                cmd: this._get_universal_hex_noFF([currentByte+5])
            });
            currentByte = currentByte+6;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }

    spbzip_package_30()
    {
        var res = true;

        res = res && this._set_universal_int_noFF( [1],'num_package' );
        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 4; i++)
        {
            this.journal.push({
                service_info: this._get_universal_hex_noFF([currentByte]),
                date_begin: this._get_universal_int_noFF([currentByte+1,currentByte+2,currentByte+3,currentByte+4]),
                date_end: this._get_universal_int_noFF([currentByte+5,currentByte+6,currentByte+7,currentByte+8]),
                service_info_2: this._get_universal_hex_noFF([currentByte+9])
            });
            currentByte = currentByte+10;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );

        return res;
    }
    
    spbzip_package_31()
    {
        var res = true;
        res = res && this._set_universal_int_noFF( [1],'num_package' );

        if( typeof this.journal !== 'object' ) this.journal = [];
        var currentByte = 2;
        for(var i = 0; i < 3; i++)
        {
            this.journal.push({
                service_info: this._get_universal_hex_noFF([currentByte]),
                date_begin: this._get_universal_int_noFF([currentByte+1,currentByte+2,currentByte+3,currentByte+4]),
                date_end: this._get_universal_int_noFF([currentByte+5,currentByte+6,currentByte+7,currentByte+8]),
                number_phase_deviation:this._get_number_phase(currentByte+9),
                min_value:this._get_universal_float_noFF([currentByte+10,currentByte+11],100),
                max_deviation:this._get_universal_float_negative_noFF([currentByte+12,currentByte+13],100)
            });
            var lastItemJournal = this.journal[this.journal.length-1];

            if( this.num_package == 2 && ( i===1 || i===2 ) )
            {
                lastItemJournal.number_phase_deviation = this._get_number_phaseV2(currentByte+9);
            }

            if( lastItemJournal.date_begin === undefined ) lastItemJournal.number_phase_deviation.status_parse = false;
            currentByte = currentByte+14;
        }
        res = res && this._set_universal_hex2( [currentByte,currentByte+1],'UUID' );
       
        return res;
    }
    spbzip_package_32()
    {

        var res = true;
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_int_noFF( [5,6,7,8],'active_power_A' );
        res = res && this._set_universal_int_noFF( [9,10,11,12],'active_power_B' );
        res = res && this._set_universal_int_noFF( [13,14,15,16],'active_power_C' );
        res = res && this._set_universal_int_noFF( [17,18,19,20],'active_power_summary' );

        res = res && this._set_universal_int_noFF( [21,22,23,24],'reactive_power_A' );
        res = res && this._set_universal_int_noFF( [25,26,27,28],'reactive_power_B' );
        res = res && this._set_universal_int_noFF( [29,30,31,32],'reactive_power_C' );
        res = res && this._set_universal_int_noFF( [33,34,35,36],'reactive_power_summary' );

        res = res && this._set_universal_int_noFF( [37,18,19,40],'total_power_A' );
        res = res && this._set_universal_int_noFF( [41,42,43,44],'total_power_B' );
        res = res && this._set_universal_int_noFF( [45,46,47,48],'total_power_C' );
        res = res && this._set_universal_hex2( [49,50],'UUID' );

        return res;
    }
    spbzip_package_33()
    {
        var res = true;

        res = res && this._set_universal_int( [1],'special_day_d_17' );
        res = res && this._set_universal_int( [2],'special_day_m_17' );
        res = res && this._set_universal_int( [3],'special_day_t_17' );
        res = res && this._set_universal_int( [4],'special_day_d_18' );
        res = res && this._set_universal_int( [5],'special_day_m_18' );
        res = res && this._set_universal_int( [6],'special_day_t_18' );
        res = res && this._set_universal_int( [7],'special_day_d_19' );
        res = res && this._set_universal_int( [8],'special_day_m_19' );
        res = res && this._set_universal_int( [9],'special_day_t_19' );
        res = res && this._set_universal_int( [10],'special_day_d_20' );
        res = res && this._set_universal_int( [11],'special_day_m_20' );
        res = res && this._set_universal_int( [12],'special_day_t_20' );
        res = res && this._set_universal_int( [13],'special_day_d_21' );
        res = res && this._set_universal_int( [14],'special_day_m_21' );
        res = res && this._set_universal_int( [15],'special_day_t_21' );
        res = res && this._set_universal_int( [16],'special_day_d_22' );
        res = res && this._set_universal_int( [17],'special_day_m_22' );
        res = res && this._set_universal_int( [18],'special_day_t_22' );
        res = res && this._set_universal_int( [19],'special_day_d_23' );
        res = res && this._set_universal_int( [20],'special_day_m_23' );
        res = res && this._set_universal_int( [21],'special_day_t_23' );
        res = res && this._set_universal_int( [22],'special_day_d_24' );
        res = res && this._set_universal_int( [23],'special_day_m_24' );
        res = res && this._set_universal_int( [24],'special_day_t_24' );
        res = res && this._set_universal_int( [25],'special_day_d_25' );
        res = res && this._set_universal_int( [26],'special_day_m_25' );
        res = res && this._set_universal_int( [27],'special_day_t_25' );
        res = res && this._set_universal_int( [28],'special_day_d_26' );
        res = res && this._set_universal_int( [29],'special_day_m_26' );
        res = res && this._set_universal_int( [30],'special_day_t_26' );
        res = res && this._set_universal_int( [31],'special_day_d_27' );
        res = res && this._set_universal_int( [32],'special_day_m_27' );
        res = res && this._set_universal_int( [33],'special_day_t_27' );
        res = res && this._set_universal_int( [34],'special_day_d_28' );
        res = res && this._set_universal_int( [35],'special_day_m_28' );
        res = res && this._set_universal_int( [36],'special_day_t_28' );
        res = res && this._set_universal_int( [37],'special_day_d_29' );
        res = res && this._set_universal_int( [38],'special_day_m_29' );
        res = res && this._set_universal_int( [39],'special_day_t_29' );
        res = res && this._set_universal_int( [40],'special_day_d_30' );
        res = res && this._set_universal_int( [41],'special_day_m_30' );
        res = res && this._set_universal_int( [42],'special_day_t_30' );
        res = res && this._set_universal_int( [43],'special_day_d_31' );
        res = res && this._set_universal_int( [44],'special_day_m_31' );
        res = res && this._set_universal_int( [45],'special_day_t_31' );

        res = res && this._set_universal_hex2( [46,47],'UUID' );

        return res;
    }
    ue_package_1()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_model();
        res = res && this._set_count_phase(10);
        res = res && this._set_count_rate();
        res = res && this._set_relay_state();
        res = res && this._set_release_date();
        res = res && this._set_version_soft();
        res = res && this._set_kt();
        res = res && this._set_universal_float( [23,24,25,26],1000,'sensor_rate_sum' );
        res = res && this._set_temperature(27);
        res = res && this._set_state();
        res = res && this._set_universal_int( [32],'event' );
        res = res && this._set_universal_hex( [33,34],'UUID' );
        return res;
    }
    ue_package_1_merc()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_model();
        res = res && this._set_count_phase(10);
        res = res && this._set_count_rate();
        res = res && this._set_relay_state();
        res = res && this._set_release_date();
        res = res && this._set_version_soft();
        res = res && this._set_kt();
        res = res && this._set_universal_float_noFF( [23,24,25,26],1000,'sensor_rate_sum' );
        res = res && this._set_temperature(27);
        res = res && this._set_state();
        res = res && this._set_universal_int( [32],'event' );
        res = res && this._set_universal_hex( [33,34],'UUID' );
        return res;
    }
    ue_package_2()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_count_phase(9);
        res = res && this._set_universal_float_noFF( [10,11],10,'B_1' );
        res = res && this._set_universal_float_noFF( [12,13],10,'B_2' );
        res = res && this._set_universal_float_noFF( [14,15],10,'B_3' );
        res = res && this._set_universal_float_noFF( [16,17],100,'A_1' );
        res = res && this._set_universal_float_noFF( [18,19],100,'A_2' );
        res = res && this._set_universal_float_noFF( [20,21],100,'A_3' );
        res = res && this._set_universal_float_noFF( [22,23,24,25],1,'P_1' );
        res = res && this._set_universal_float_noFF( [26,27,28,29],1,'P_2' );
        res = res && this._set_universal_float_noFF( [30,31,32,33],1,'P_3' );
        res = res && this._set_universal_float_noFF( [34,35,36,37],100,'Q_1' );
        res = res && this._set_universal_float_noFF( [38,39,40,41],100,'Q_2' );
        res = res && this._set_universal_float_noFF( [42,43,44,45],100,'Q_3' );
        res = res && this._set_universal_float_noFF( [46],100,'S_1' );
        res = res && this._set_universal_float_noFF( [47],100,'S_2' );
        res = res && this._set_universal_float_noFF( [48],100,'S_3' );
        res = res && this._set_universal_hex( [49,50],'UUID' );
        return res;
    }
    ue_package_2_merc()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_count_phase(9);
        res = res && this._set_universal_float_noFF( [10,11],100,'B_1' );
        res = res && this._set_universal_float_noFF( [12,13],100,'B_2' );
        res = res && this._set_universal_float_noFF( [14,15],100,'B_3' );
        res = res && this._set_universal_float_noFF( [16,17],1000,'A_1' );
        res = res && this._set_universal_float_noFF( [18,19],1000,'A_2' );
        res = res && this._set_universal_float_noFF( [20,21],1000,'A_3' );
        res = res && this._set_universal_float_negative_noFF( [22,23,24,25],100,'P_1' );
        res = res && this._set_universal_float_negative_noFF( [26,27,28,29],100,'P_2' );
        res = res && this._set_universal_float_negative_noFF( [30,31,32,33],100,'P_3' );
        res = res && this._set_universal_float_negative_noFF( [34,35,36,37],100,'Q_1' );
        res = res && this._set_universal_float_negative_noFF( [38,39,40,41],100,'Q_2' );
        res = res && this._set_universal_float_negative_noFF( [42,43,44,45],100,'Q_3' );
        res = res && this._set_universal_float_noFF( [46],100,'S_1' );
        res = res && this._set_universal_float_noFF( [47],100,'S_2' );
        res = res && this._set_universal_float_noFF( [48],100,'S_3' );
        res = res && this._set_universal_hex( [49,50],'UUID' );
        return res;
    }
    ue_package_3()
    {
        var res = true;
        res = res && this._set_size_package_in();
        res = res && this._set_size_package_out();
        res = res && this._set_num_out();
        res = res && this._set_count_package();
        res = res && this._set_data_b(6);
        return res;
    }
    ue_package_4()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_time(5,6,7,8);
        res = res && this._set_count_rate_active();
        res = res && this._set_rate_active();
        res = res && this._set_universal_float_noFF( [11,12],100,'kt' );
        res = res && this._set_universal_float_noFF( [13,14,15,16],1000,'sensor_rate_sum' );
        res = res && this._set_universal_float_noFF( [17,18,19,20],1000,'sensor_rate_1' );
        res = res && this._set_universal_float_noFF( [21,22,23,24],1000,'sensor_rate_2' );
        res = res && this._set_universal_float_noFF( [25,26,27,28],1000,'sensor_rate_3' );
        res = res && this._set_universal_float_noFF( [29,30,31,32],1000,'sensor_rate_4' );
        res = res && this._set_universal_hex( [33,34],'UUID' );
        return res;
    }
    
    ue_package_5()
    {
        var res = true;
        res = res && this._set_serial();
        
        res = res && this._set_universal_int( [5,6,7,8],'date_1' );
        res = res && this._set_universal_int( [9],'period_avg_1' );
        res = res && this._set_universal_int( [10],'note_1' );
        res = res && this._set_universal_int_noFF( [11,12,13,14],'A_p_1' );
        res = res && this._set_universal_int_noFF( [15,16,17,18],'A_m_1' );
        res = res && this._set_universal_int_noFF( [19,20,21,22],'R_p_1' );
        res = res && this._set_universal_int_noFF( [23,24,25,26],'R_m_1' );
        res = res && this._set_universal_int( [27,28,29,30],'date_2' );
        res = res && this._set_universal_int( [31],'period_avg_2' );
        res = res && this._set_universal_int( [32],'note_2' );
        res = res && this._set_universal_int_noFF( [33,34,35,36],'A_p_2' );
        res = res && this._set_universal_int_noFF( [37,38,39,40],'A_m_2' );
        res = res && this._set_universal_int_noFF( [41,42,43,44],'R_p_2' );
        res = res && this._set_universal_int_noFF( [45,46,47,48],'R_m_2' );
        res = res && this._set_universal_hex( [49,50],'UUID' );
        return res;
    }
    ue_package_6()
    {
        var res = true;
        res = res && this._set_serial();
        res = res && this._set_universal_int( [5],'result' );
        res = res && this._set_universal_hex( [6,7],'UUID' );
        return res;
    }
    ue_package_7()
    {
        var res = true;
        return res;
    }
    ue_package_8()
    {
        var res = true;
        return res;
    }
    lm_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_time(2,3,4,5);
        res = res && this._set_temperature(6);
        res = res && this._set_universal_boolean(7,'in_move' );
        res = res && this._set_universal_float( [8,9],10,'angle' );
        res = res && this._set_universal_boolean(10,'coord_status' );
        res = res && this._set_universal_float( [11,12,13,14],1000000,'lat' );
        res = res && this._set_universal_float( [15,16,17,18],1000000,'lng' );
        res = res && this._set_universal_int( [19,20],'dir' );
        res = res && this._set_universal_int( [21,22],'speed' );
        res = res && this._set_universal_int( [23,24],'alt' );
        res = res && this._set_universal_int( [25],'sat_visible' );
        res = res && this._set_universal_int( [26],'sat_used' );
        res = res && this._set_universal_boolean( [27],'alarm' );
        return res;
    }
    src_package()
    {
        var res = true;
        res = res && this._set_universal_int( [0], 'reason' );
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_hex( [5],'status_state' );
        res = res && this._set_universal_boolean(6,'state_tamper' );
        res = res && this._set_universal_int( [7],'led_duty' );
        res = res && this._set_universal_int( [8],'charge' );
        res = res && this._set_temperature(9);
        res = res && this._set_universal_float( [10],1,'angle' );
        res = res && this._set_universal_int( [11,12],'nomenal_voltage' );
        res = res && this._set_universal_int( [13,14],'total_power_summary' );

        res = res && this._set_universal_float( [15,16,17,18],1000000,'lat' );
        res = res && this._set_universal_float( [19,20,21,22],1000000,'lng' );
        return res;
    }
    ug_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [0],'charge' );
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_temperature(5);
        res = res && this._set_universal_int( [6],'reason' );
        res = res && this._set_universal_boolean(7,'sensor_in_1' );
        res = res && this._set_universal_boolean(8,'sensor_in_2' );
        res = res && this._set_universal_boolean(9,'sensor_out_1' );
        res = res && this._set_universal_boolean(10,'sensor_out_2' );
        res = res && this._set_universal_boolean(11,'hall_1' ); 
        res = res && this._set_universal_boolean(12,'state_tamper' );
        res = res && this._set_universal_float( [13,14,15,16],100,'sensor_rate_sum' );
        res = res && this._set_universal_float( [17,18,19,20],100,'sensor_rate_0' );
        return res;
    }
    sve_1_package_1()
    {
      //  console.log('sve_1_package_1' );
        if (this._set_charge())
        {
            if (this._set_temperature(2))
            {
                if (this._set_hall_1())
                {
                    if (this._set_display())
                    {
                        if (this._set_time(5,6,7,8))
                        {
                            if (this._set_leaking())
                            {
                                if (this._set_breakthrough())
                                {
                                    if (!this._set_sensorKB())
                                    {
                                        return false;
                                    }
                                }
                                else
                                {
                                    return false;
                                }
                            }
                            else
                            {
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                       return false;
                    }
                }
                else
                {
                   return false;
                }
            }
            else
            {
               return false;
            }
        }
        else
        {
           return false;
        }
        return true;
    }
    tp_11_package_5()
    {
       // console.log('tp_11_package_5' );
        if (this._set_charge())
         {
             if (!this._set_status_sensor_out())
             {
                  return false;
             }
         }
         else
         {
            return false;
         }
         return true;
    }
    tp_11_package_1()
    {
       // console.log('tp_11_package_1' );
        if (this._set_charge())
         {
             if (this._set_switch_device_tp11())
             {
                if (this._set_temperature(3))
                {
                    if (this._set_reason(4))
                    {
                        if (this._set_status_tp11())
                        {
                            if (!this._set_sensorTP())
                            {
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                     return false;
                }    
             }
             else
             {
                 return false;
             }

         }
         else
         {
            return false;
         }
         return true;
    }
    smart_mc11rev2_package_1 ()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_universal_float_negative( [3,4],10,'temperature' );
        res = res && this._set_reason(5);
        res = res && this._set_status_smart();
        res = res && this._set_time(7,8,9,10);
        return res;
    }
    smart_ms0101Rev2_package_1 ()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_universal_float_negative( [3,4],10,'temperature' );
        res = res && this._set_reason(5);
        res = res && this._set_time(6,7,8,9);
        return res;
    }
    smart_as0101Rev2_package_1 ()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_universal_int( [2],'angle' );
        res = res && this._set_universal_float_negative( [3,4],10,'temperature' );
        res = res && this._set_reason(5);
        res = res && this._set_status_smart();
        res = res && this._set_time(7,8,9,10);
        return res;
    }
    smart_package_1()
    {
        if (this._set_charge())
         {
             if (this._set_switch_device_smart())
             {
                if (this._set_temperature_b2())
                {
                    if (this._set_reason(5))
                    {
                        if (!this._set_status_smart())
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                     return false;
                }    
             }
             else
             {
                 return false;
             }

         }
         else
         {
            return false;
         }
         return true;
    }
    tl11_package()
    {
        var res = true;
        res = res && this._set_universal_int( [0],'charge' );
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_float_negative( [5,6],10,'temperature' );
        res = res && this._set_universal_float_negative( [7,8],10,'temperature_2' );
        res = res && this._set_switch_state_tl11(9);
        return res;
    }
    td12_package()
    {
        var res = true;
        res = res && this._set_universal_int( [0],'charge' );
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_float_negative( [5,6],10,'temperature' );
        res = res && this._set_universal_float_negative( [7,8],10,'temperature_2' );
        res = res && this._set_switch_state_td12(9);
        return res;
    }
    td_11rev2_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_universal_boolean(2,'limit_exceeded' );
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_universal_float_negative( [7,8],10,'temperature' );
        res = res && this._set_universal_int_negative( [9],'min_temperature' );
        res = res && this._set_universal_int_negative( [10],'max_temperature' );
        res = res && this._set_reason(11);
        res = res && this._set_status(12);
        return res;
        
    }
    tp_11rev2_package_5()
    {
        if (this._set_charge())
         {
            if(this._set_time(4,5,6,7))
            {
               if (!this._set_status_sensor_out())
               {
                    return false;
               }
            }
            else
            {
                return false;
            }
         }
         else
         {
            return false;
         }
         return true;
    }
    mbus_2_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_switch_device_smart();
        res = res && this._set_universal_hex( [3,4,5,6], 'address' );
        res = res && this._set_time( 7,8,9,10 );
        res = res && this._set_universal_int( [11,12,13,14], 'sensor_rate_sum' );
        res = res && this._set_universal_int( [15,16,17,18], 'total_heat_carrier_volume' );
        res = res && this._set_universal_int( [19,20,21,22], 'working_time_h' );
        res = res && this._set_universal_float_negative( [23,24],100,'temperature' );
        res = res && this._set_universal_float_negative( [25,26],100,'temperature_2' );
        res = res && this._set_universal_int( [27,28], 'current_coolant_flow' );
        return res;
    }
    mbus_1_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_switch_device_mbus();
        res = res && this._set_universal_hex( [3,4,5,6], 'address' );
        res = res && this._set_time( 7,8,9,10 );
        res = res && this._set_universal_int( [11,12,13,14], 'sensor_rate_sum' );
        res = res && this._set_universal_int( [15,16,17,18], 'total_heat_carrier_volume' );
        res = res && this._set_universal_int( [19,20,21,22], 'working_time_h' );
        res = res && this._set_universal_float_negative( [23,24],100,'temperature' );
        res = res && this._set_universal_float_negative( [25,26],100,'temperature_2' );
        res = res && this._set_universal_int( [27,28], 'current_coolant_flow' );
        return res;
    }
    mbus_1_package_3()
    {
        var res = true;
        res = res && this._set_universal_int( [1,2],'size_data' );
        res = res && this._set_universal_int( [3],'size_data_package' );
        res = res && this._set_universal_int( [4],'num_package' );
        res = res && this._set_universal_int( [5],'count_package' );
        res = res && this._set_data_b(6);
        return res;
    }
    mbus_1_package_4()
    {
        var res = true;
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_switch_device_mbus();
        res = res && this._set_universal_boolean(3,'state_energy' );
        return res;
    }
    mbus_1_package_5()
    {
        var res = true;
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_switch_device_mbus();
        res = res && this._set_num_channel();
        res = res && this._set_universal_int( [4], 'sensor_11' );
        res = res && this._set_universal_int( [5], 'sensor_12' ) ;
        this.sensors.sensor_11=this.sensor_11;
        this.sensors.sensor_12=this.sensor_12;
        return res;
    }
    gm_1_package()
    {
        var res = true;
        res = res && this._set_universal_int( [0], 'reason' );
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_time(2,3,4,5);
        res = res && this._set_temperature(6);
        res = res && this._set_universal_float( [7,8,9,10],1000, 'sensor_rate_sum' );
        return res;
    }
    gm_1_package_rev2()
    {
        var res = true;
        res = res && this._set_universal_int( [0], 'reason' );
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_time(2,3,4,5);
        res = res && this._set_temperature(6);
        res = res && this._set_universal_float( [7,8,9,10],1000, 'sensor_rate_sum' );
        res = res && this._set_universal_int( [11], 'count' );
        return res;
    }
    um0101_package()
    {
        var res = true;
        res = res && this._set_universal_int( [0], 'reason' );
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_time(2,3,4,5);
        res = res && this._set_universal_int( [6], 'type_powered' );
        res = res && this._set_universal_float_negative( [7,8],10,'temperature' );
        res = res && this._set_universal_int( [9], 'damp' );

        res = res && this._set_universal_int( [10,11], 'lux' );
        res = res && this._set_universal_int( [12], 'dB' );
        res = res && this._set_universal_int( [13,14], 'CO2' );

        res = res && this._set_universal_int( [15],'angle' );


        res = res && this._set_universal_int( [16],'min_temperature' );
        res = res && this._set_universal_int( [17],'max_temperature' );

        res = res && this._set_universal_int( [18], 'min_damp' );
        res = res && this._set_universal_int( [19], 'max_damp' );

        res = res && this._set_universal_int( [20,21], 'min_lux' );
        res = res && this._set_universal_int( [22,23], 'max_lux' );

        res = res && this._set_universal_int( [24], 'min_dB' );
        res = res && this._set_universal_int( [25], 'max_dB' );

        res = res && this._set_universal_float( [26],0.1, 'min_CO2' ); //?
        res = res && this._set_universal_float( [27],0.1, 'max_CO2' ); //?

        return res;
    }
    hs0101_package()
    {
        var res = true;
        res = res && this._set_universal_int( [0], 'reason' );
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_time(2,3,4,5);
        res = res && this._set_universal_float_negative( [6,7],10,'temperature' );
        res = res && this._set_universal_int( [8], 'damp' );
        res = res && this._set_universal_boolean(9,'sensor_in_1' );
        res = res && this._set_universal_boolean(10,'sensor_in_2' );
        res = res && this._set_universal_int( [11],'angle' );
        res = res && this._set_universal_int( [12],'min_sensor' );
        res = res && this._set_universal_int( [13],'max_sensor' );
        res = res && this._set_universal_int_negative( [14],'min_temperature' );
        res = res && this._set_universal_int_negative( [15],'max_temperature' );
        return res;
    }
    mbus_1_package_6()
    {
        var res = true;
        res = res && this._set_universal_int( [1], 'charge' );
        res = res && this._set_switch_device_mbus();
        res = res && this._set_universal_int( [3],'num_out_channel' );
        if( this.num_out_channel == 1 )
        {
            res = res && this._set_universal_boolean(4,'sensor_out_1' );
        }
        else if( this.num_out_channel == 2 )
        {
            res = res && this._set_universal_boolean(4,'sensor_out_2' );
        }
        return res;
    }
    si_13_therm_package_1(key_map)
    {
        var res = true;
        res = res && this._set_time(1,2,3,4);
        res = res && this._set_universal_hex( [10,9,8,7,6,5], 'address' );
        res = res && this._set_universal_int_negative( [11],'rssi_sensor' );
        res = res && this._set_universal_int( [12],'size_data' );
        res = res && this._set_data_b_rev(13,13+this.size_data);
        // парсим данные от самого датчика
        this.data_therm_1 = this.data_b.slice(0,5);
        this.data_therm_2 = this.data_b.slice(5,7);
        if( this.data_therm_2.join('') != '9205' ) res = false;
        this.data_therm_3 = this.data_b.slice(7,13); //mac
        this.data_therm_4 = this.data_b.slice(13,15); //type
        this.data_type = this.data_therm_4.join('');
        if( this.data_type != '0100' ) res = false;
        this.data_sensor = this.data_b.slice(15);
        if(res)
        {
            var mac = this.address.toLowerCase();
            var key = key_map[mac];
            if(key)
            {
                var dataEncrypt = this.data_sensor.join('');
                var my_convert =  new vega_converter();
                var resDecode = my_convert.decodeAes(dataEncrypt,key);
                if(resDecode.status && typeof resDecode.data === 'string')
                {
                    var data = my_convert.hexToBytes(resDecode.data);
                    var val1 = data.slice(0,3).join('');
                    var intVal1 = parseInt(val1,16);
                    var binaryVal1 = intVal1.toString(2);
                    while (binaryVal1.length < 24) binaryVal1 = '0'+binaryVal1;
                    var val1_bin1 = binaryVal1.slice(0,12);
                    var val1_bin2 = binaryVal1.slice(12,24);
                    var s = parseInt(val1_bin1,2);
                    var u = parseInt(val1_bin2,2);
                    if(isNaN(s)||isNaN(u)) res = false;
                    this.mv = u;
                    this.num_package = s;
                    for(var i = 0; i<=12; i++)
                    {
                        this[`temperature_num_${i}`] = parseInt(data[3+i]);
                        if(isNaN(this[`temperature_num_${i}`])) res = false;
                    }
                    
                    //parseInt(temp1.slice(0,3).join(''),16).toString(2).length
                    //var val1 = 
                    //напряжение 012 mv
                    //счетчик 012  num_package  
                    //температура 3
                    //console.log(data,u,s,t0);
                }
                else
                {
                    res = false;
                }
            }
            else 
            {
                res = false;
            }
        }
        //data_therm_1 4 data_type data_sensor
        //if(!res) console.log('Брак!');
        return res;
    }
    tp_11rev2_package_1()
    {
        var res = true;
        res = res && this._set_universal_int( [1],'charge' );
        res = res && this._set_universal_boolean(2,'limit_exceeded' );
        res = res && this._set_time(3,4,5,6);
        res = res && this._set_temperature(7);
        res = res && this._set_universal_float_negative( [8,9],100,'min_sensor' );
        res = res && this._set_universal_float_negative( [10,11],100,'max_sensor' );
        res = res && this._set_reason(12);
        res = res && this._set_status_tp11(13);
        res = res && this._set_universal_float( [14,15],100,'sensorTP' );
        return res;
    }
    td_11_package_1()
    {
        if (this._set_charge())
         {
             if (this._set_switch_device())
             {
                if (this._set_temperature_b2())
                {
                    if (this._set_reason(5))
                    {
                        if (!this._set_status())
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                     return false;
                }    
             }
             else
             {
                 return false;
             }

         }
         else
         {
            return false;
         }
         return true;
    }
    si_11_package_2()
    {
        if (this._set_charge())
        {
            if (this._set_switch_device())
            {
                if (this._set_num_channel())
                {
                       this.comment=JSON.stringify(this);
                       if (this.hex_array.length==20)
                       {
                           this._set_sensors_opt();
                       }
                       else
                       {
                           this._set_time(4,5,6,7);
                           this._set_sensors_opt(8);
                       }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
           return false;
        }
        return true;
    }
    back_door(text)
    {
        this.comment=text;
        return true;
    }
    set_data(hex,key_map)
    {
        var currentVersion = parseInt(this.version);
        switch (this.device_type) {
            case 1:
                if (this._set_hex(hex))
                {
                     switch(this.type_package) {
                        case 1: 
                           return this.si_11_package_1();
                        break;
                        case 2:  
                           return this.si_11_package_2();
                        break;
                        case 3:  
                           console.log('3 package is no longer used' );
                           return true;
                        break;
                        default:
                            return false;
                        break;
                     }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 2:
                if (this._set_hex(hex))
                {
                     switch(this.type_package) {
                        case 1: 
                           return this.si_12_package_1();
                        break;
                        case 2:  
                           return this.si_12_package_2();
                        break;
                        case 3:  
                        //    return this.si_12_package_3();
                        break;
                        case 4:
                            return this.si_12_package_4();
                        break;
                        case 5:  
                           return this.si_12_package_5();
                        break;
                        default:
                            return false;
                        break;
                     }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 11:
              //  console.log('Данные си11' );
                if (this._set_hex(hex))
                {
                    let port = this.port;
                    if( port == 4 )
                    {
                        if(this.type_package == 255) return this.package_correction_time();
                    }
                    else if( port == 3 )
                    {
                        if(this.type_package == 0) return this.package_settings();
                    }
                    if ( this.version == 0 && port == 2)
                    {
                        
                        switch(this.type_package) {
                            case 1: 
                            return this.si_11_package_1();
                            break;
                            case 2:  
                            return this.si_11_package_2();
                            break;
                            case 3:  
                            console.log('3 package is no longer used' );
                            return true;
                            break;
                            default:
                                return false;
                            break;
                        }
                    }
                    else if ( this.version == 1 )
                    {
                        if( port == 2 )
                        {
                            switch(this.type_package) {
                                case 1: 
                                    return this.si_21_or_22_package_1_rev2();
                                break;
                                case 2:  
                                    return this.si_21_or_22_package_2_rev2();
                                break;
                                default:
                                    return false;
                                break;
                            }
                        }
                        else if( port == 195 && this.type_package == 195 ) 
                        {
                            return this.si_21_or_22_package_195_rev2();
                        }
                        else if( port == 85 ) 
                        {
                            return this.si_21_or_22_package_85_rev2();
                        }
                    }
                    else if ( currentVersion === 2  )
                    {
                        if( port == 2 )
                        {
                            return this.si_21_or_22_package_rev3();
                        }
                        else if( port == 195 && this.type_package == 195 ) 
                        {
                            return this.si_21_or_22_package_195_rev2();
                        }
                        else if( port == 85 ) 
                        {
                            return this.si_21_or_22_package_85_rev2();
                        }
                        else if( port == 4 ) 
                        {
                            if(this.type_package == 255) return this.package_correction_time();
                        }
                    }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 3:
             //   console.log('Данные си13' );
                if (this._set_hex(hex))
                {
                    let port = this.port;
                    if ( port == 2 )
                    {
                        if ( this.version == 0 )
                        {
                            switch(this.type_package) {
                                case 1: 
                                return this.si_13_package_1();
                                break;
                                case 2:  
                                return this.si_13_package_2();
                                break;
                                case 3:  
                                return this.si_13_package_3();
                                break;
                                case 4:  
                                return this.si_13_package_4();
                                break;
                                case 5:  
                                return this.si_13_package_5();
                                break;
                                default:
                                    return false;
                                break;
                            }
                        }
                        else if ( this.version == 1 )
                        {
                            switch(this.type_package) {
                                case 1: 
                                return this.si_13rev2_package_1();
                                break;
                                case 2:  
                                return this.si_13rev2_package_2();
                                break;
                                case 3:  
                                return this.si_13_package_3();
                                break;
                                case 4:  
                                return this.si_13rev2_package_4();
                                break;
                                case 5:  
                                return this.si_13_package_5();
                                break;
                                case 6:  
                                return this.si_13rev2_package_6();
                                break;
                                default:
                                    return false;
                                break;
                            }
                        }
                    }
                    else if( port == 4 )
                    {
                        if(this.type_package == 255) return this.package_correction_time();
                    }
                    else if( port == 3 )
                    {
                        if(this.type_package == 0) return this.package_settings();
                    }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 4:
              //  console.log('Данные td-11' );
                if (this._set_hex(hex))
                {
                    if ( this.version == 0 )
                    {
                        switch ( this.type_package ) {
                            case 1: 
                               return this.td_11_package_1();
                            break;
                            default:
                                return false;
                            break;
                         }
                    }
                    else if ( this.version == 1 )
                    {
                        switch ( this.type_package ) {
                            case 1: 
                               return this.td_11rev2_package_1();
                            break;
                            default:
                                return false;
                            break;
                         }
                    }
                    return false;
                }
                else
                {
                   return false;
                }
                break;
            case 5:
            //    console.log('Данные тп11' );
                if (this._set_hex(hex))
                {
                    if ( this.version == 0 )
                    {
                        switch(this.type_package) {
                           case 1: 
                              return this.tp_11_package_1();
                           break;
                           case 5:  
                              return this.tp_11_package_5();
                           break;
                           default:
                               return false;
                           break;
                        }
                    }
                    else if ( this.version == 1 )
                    {
                        switch(this.type_package) {
                           case 1: 
                              return this.tp_11rev2_package_1();
                           break;
                           case 5:  
                              return this.tp_11rev2_package_5();
                           break;
                           default:
                               return false;
                           break;
                        }
                    }
                    return false;
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 6:
             //   console.log('Данные MC' );
                if (this._set_hex(hex))
                {
                    if ( this.version == 0 )
                    {
                        switch(this.type_package) 
                        {
                            case 1: 
                                return this.smart_package_1();
                            break;
                            default:
                                return false;
                            break;
                        }
                    }
                    else if( this.version == 1 )
                    {
                        switch(this.type_package) {
                            case 1: 
                               return this.smart_mc11rev2_package_1();
                            break;
                            default:
                                return false;
                            break;
                         }
                    }
                }
                else
                {
                   return false;
                }
                break;
            case 7:
              //  console.log('Данные AS' );
                if (this._set_hex(hex))
                {
                    if ( this.version == 0 )
                    {
                        switch(this.type_package) {
                            case 1: 
                               return this.smart_package_1();
                            break;
                            default:
                                return false;
                            break;
                        }
                    }
                    else if ( this.version == 1 )
                    {
                        switch(this.type_package) {
                            case 1: 
                               return this.smart_as0101Rev2_package_1();
                            break;
                            default:
                                return false;
                            break;
                        }
                    }
                }
                else
                {
                   return false;
                }
                break;
            case 8:
              //  console.log('Данные MS' );
                if (this._set_hex(hex))
                {
                    if ( this.version == 0 )
                    {
                        switch(this.type_package) 
                        {
                            case 1: 
                               return this.smart_package_1();
                            break;
                            default:
                                return false;
                            break;
                         }
                    }
                    else if ( this.version >= 1 )
                    {
                        switch(this.type_package) {
                            case 1: 
                               return this.smart_ms0101Rev2_package_1();
                            break;
                            default:
                                return false;
                            break;
                        }
                    }
                }
                else
                {
                   return false;
                }
                break;
            
            case 9:
             //   console.log('Данные sve1' );
                if (this._set_hex(hex))
                {
                    switch(this.type_package) {
                        case 1: 
                           return this.sve_1_package_1();
                        break;
                        default:
                            return false;
                        break;
                     }
                }
                else
                {
                   return false;
                }
                break;
            case 10:
              //  console.log('Данные SS' );
                if (this._set_hex(hex))
                {
                    switch(this.type_package) {
                        case 1: 
                           return this.smart_package_1();
                        break;
                        default:
                            return false;
                        break;
                     }
                }
                else
                {
                   return false;
                }
                break;
            case 12:
               // console.log('Данные УЭ' );
                if (this._set_hex(hex))
                {
                     switch(this.type_package) {
                        case 1: 
                           return this.ue_package_1();
                        break;
                        case 2:  
                           return this.ue_package_2();
                        break;
                        case 3:  
                           return this.ue_package_3();
                        case 4:  
                           return this.ue_package_4();
                        break;
                        case 5:  
                           return this.ue_package_5();
                        break;
                        case 6:  
                           return this.ue_package_6();
                        break;
                        default:
                            return false;
                        break;
                     }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 13:
                if (this._set_hex(hex))
                {
                    switch(this.port) {
                        case 2: 
                           return this.ug_package_1();
                        break;
                        default:
                            return false;
                        break;
                     }
                }
                else
                {
                   return false;
                }
                break;
            case 14:
                if (this._set_hex(hex))
                {
                    switch(this.port) {
                        case 2: 
                           return this.lm_package_1();
                        break;
                        default:
                            return false;
                        break;
                     }
                }
                else
                {
                   return false;
                }
                break;
            case 15:
                if (this._set_hex(hex))
                {
                    switch(this.port) {
                        case 2: 
                            if ( this.version == 0 )
                            {
                                return this.td12_package();
                            }
                            else
                            {
                                return this.tl11_package();
                            }
                        break;
                        default:
                            return false;
                        break;
                     }
                }
                else
                {
                   return false;
                }
                break;
            case 17:
                    //   console.log('Данные gm-1' );
                    if (this._set_hex(hex))
                    {
                        if ( this.version == 0 )
                        {
                            return this.gm_1_package();
                        }
                        else
                        {
                            return this.gm_1_package_rev2();
                        }
                    }
                    else
                    {
                        return false;
                    }
                    break;
            case 18:
                if (this._set_hex(hex))
                {
                    let port = this.port;
                    if( port == 4 )
                    {
                        if(this.type_package == 255) return this.package_correction_time();
                    }
                    else if( port == 3 )
                    {
                        if(this.type_package == 0) return this.package_settings();
                    }
                    if ( this.version == 0 && port == 2)
                    {
                        switch(this.type_package) {
                            case 1: 
                                return this.si_22_package_1();
                            break;
                            case 2:  
                                return this.si_22_package_2();
                            break;
                            default:
                                return false;
                            break;
                        }
                    }
                    else if ( this.version == 1 )
                    {
                        if( port == 2 )
                        {
                            switch(this.type_package) {
                                case 1: 
                                    return this.si_21_or_22_package_1_rev2();
                                break;
                                case 2:  
                                    return this.si_21_or_22_package_2_rev2();
                                break;
                                default:
                                    return false;
                                break;
                            }
                        }
                        else if( port == 195 && this.type_package == 195 ) 
                        {
                            return this.si_21_or_22_package_195_rev2();
                        }
                        else if( port == 85 ) 
                        {
                            return this.si_21_or_22_package_85_rev2();
                        }
                    }
                    else if ( currentVersion === 2  )
                    {
                        if( port == 2 )
                        {
                            return this.si_21_or_22_package_rev3(); 
                        }
                        else if( port == 195 && this.type_package == 195 ) 
                        {
                            return this.si_21_or_22_package_195_rev2();
                        }
                        else if( port == 85 ) 
                        {
                            return this.si_21_or_22_package_85_rev2();
                        }
                        else if( port == 4 ) 
                        {
                            if(this.type_package == 255) return this.package_correction_time();
                        }
                    }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 20:
                //   console.log('Данные m-bus-1' );
                if (this._set_hex(hex))
                {
                    switch(this.type_package) {
                        case 1: 
                            return this.mbus_1_package_1();
                            break;
                        case 3:  
                            return this.mbus_1_package_3();
                            break;
                        case 4:  
                            return this.mbus_1_package_4();
                            break;
                        case 5:  
                            return this.mbus_1_package_5();
                            break;
                        case 6:  
                            return this.mbus_1_package_6();
                            break;
                        default:
                            return false;
                        break;
                    }
                }
                else
                {
                    return false;
                }
                break;
            case 21:
                //   console.log('Данные m-bus-2' );
                   if (this._set_hex(hex))
                   {
                        switch(this.type_package) {
                           case 1: 
                              return this.mbus_2_package_1();
                              break;
                           default:
                               return false;
                           break;
                        }
                    }
                    else
                    {
                       return false;
                    }
                   break;
                case 23:
                //   console.log('Данные hs0101' );
                    if (this._set_hex(hex))
                    {
                        return this.hs0101_package();
                    }
                    else
                    {
                        return false;
                    }
                    break;
                case 24:
                    // console.log('Данные spbzip' );
                    if (this._set_hex(hex))
                    {
                        let port = this.port;
                        let type_package = this.type_package;
                        if( port == 2 )
                        {
                            if(type_package == 1) return this.spbzip_package_1();
                            if(type_package == 2) return this.spbzip_package_2();
                            if(type_package == 3) return this.spbzip_package_3();
                            if(type_package == 4) return this.spbzip_package_4();
                            if(type_package == 5) return this.spbzip_package_5();
                            if(type_package == 6) return this.spbzip_package_6();
                            if(type_package == 7) return this.spbzip_package_7();
                            if(type_package == 32) return this.spbzip_package_32();
                        }
                        else if( port == 5 )
                        {
                            if(this.type_package == 8) return this.spbzip_package_8();
                            if(this.type_package == 9) return this.spbzip_package_9();
                            if(this.type_package == 10) return this.spbzip_package_10();
                            if(this.type_package == 11) return this.spbzip_package_11();
                            if(this.type_package == 12) return this.spbzip_package_12();
                            if(this.type_package == 13) return this.spbzip_package_13();
                            if(this.type_package == 14) return this.spbzip_package_14();
                            if(this.type_package == 15) return this.spbzip_package_15();
                            if(this.type_package == 33) return this.spbzip_package_33();
                        }
                        else if( port == 6 )
                        {
                            if(this.type_package == 16) return this.spbzip_package_16();
                            if(this.type_package == 17) return this.spbzip_package_17();
                            if(this.type_package == 18) return this.spbzip_package_18();
                        }
                        else if( port == 7 )
                        {
                            if(this.type_package == 19) return this.spbzip_package_19();
                            if(this.type_package == 20) return this.spbzip_package_20();
                            if(this.type_package == 21) return this.spbzip_package_21();
                            if(this.type_package == 22) return this.spbzip_package_22();
                            if(this.type_package == 23) return this.spbzip_package_23();
                            if(this.type_package == 24) return this.spbzip_package_24();
                            if(this.type_package == 25) return this.spbzip_package_25();
                            if(this.type_package == 26) return this.spbzip_package_26();
                            if(this.type_package == 27) return this.spbzip_package_27();
                            if(this.type_package == 28) return this.spbzip_package_28();
                            if(this.type_package == 29) return this.spbzip_package_29();
                            if(this.type_package == 30) return this.spbzip_package_30();
                            if(this.type_package == 31) return this.spbzip_package_31();
                        }
                        else if( port == 4 )
                        {
                            if(this.type_package == 255) return this.package_correction_time();
                        }
                        else if( port == 3 )
                        {
                            if(this.type_package == 0) return this.package_settings();
                        }
                    }
                return false;
                break;
            case 25:
                //   console.log('Данные um0101' );
                let port = this.port;
                if ( this._set_hex(hex) && port == 2 )
                {
                    return this.um0101_package();
                }
                else
                {
                    return false;
                }
                break;
            case 26:
                if (this._set_hex(hex))
                {
                    let port = this.port;
                    if( port == 2 )
                    {
                        return this.src_package();
                    }
                    else if( port == 4 )
                    {
                        if(this.type_package == 255) return this.package_correction_time();
                    }
                    else if( port == 3 )
                    {
                        if(this.type_package == 0) return this.package_settings();
                    }   
                }
                else
                {
                    return false;
                }
                break;
            case 27:
               // console.log('Данные УЭ меркурий' );
                if (this._set_hex(hex))
                {
                     switch(this.type_package) {
                        case 1: 
                           return this.ue_package_1_merc();
                        break;
                        case 2:  
                           return this.ue_package_2_merc();
                        break;
                        case 3:  
                           return this.ue_package_3();
                        case 4:  
                           return this.ue_package_4();
                        break;
                        case 5:  
                           return this.ue_package_5();
                        break;
                        case 6:  
                           return this.ue_package_6();
                        break;
                        default:
                            return false;
                        break;
                     }
                 }
                 else
                 {
                    return false;
                 }
                break;
            case 28:
                // console.log('Данные sh-02' );
                    if (this._set_hex(hex))
                    {
                        if( this.type_package == 1 || this.type_package == 9 ) return this.sh02_package();
                    }
                    return false;
                    break;
            case 30:
                //  console.log('Данные си13 therm' );
                if (this._set_hex(hex))
                {
                    let port = this.port;
                    if( port == 4 )
                    {
                        if(this.type_package == 255) return this.package_correction_time();
                    }
                    else if( port == 3 )
                    {
                        if(this.type_package == 0) return this.package_settings();
                    }
                    else if( port == 195 && this.type_package == 195 ) 
                    {
                        return this.si_21_or_22_package_195_rev2();
                    }
                    else if( port == 85 ) 
                    {
                        return this.si_21_or_22_package_85_rev2();
                    }
                    else if ( port == 2 && this.type_package == 1)
                    {
                        return this.si_13_therm_package_1(key_map);
                        
                    }
                    return false;
                 }
                 else
                 {
                    return false;
                 }
                break;
            default:
                console.log('Данные неизвестного для типа' );
                return false;
                break;
        }
    }
    
    
}
module.exports = Parser;
