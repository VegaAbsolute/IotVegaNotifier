class Parser
{
  constructor(dt,data,port)
    {
        //step 2
        this.type_package;
        this.comment;
        this.hex;
        this.hex_array;
        this.charge;
        this.switch_device=[];
        this.time;
        this.temperature;
        this.sensors=new Object();
        this.num_channel = 0;
        this.count =0;
        this.type_archive;
        this.last_time;
        this.reason;
        this.archive=[];
        this.device_type = parseInt(dt);
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
        this.coord_status;
        this.lat;
        this.lon;
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

        this.address;
        this.cmd_code;
        this.size_data;
        this.size_data_package;
        this.num_package;
        this.port = port;
        this.validParse=this.set_data(data);
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
        this.hex_array=[];
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
            if(this.temperature>127)
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
    _set_sensors_opt()
    {
        try
        {
            this.sensors.sensor_1=parseInt(this.hex_array[7]+this.hex_array[6]+this.hex_array[5]+this.hex_array[4],16);
            this.sensors.sensor_2=parseInt(this.hex_array[11]+this.hex_array[10]+this.hex_array[9]+this.hex_array[8],16);
            this.sensors.sensor_3=parseInt(this.hex_array[15]+this.hex_array[14]+this.hex_array[13]+this.hex_array[12],16);
            this.sensors.sensor_4=parseInt(this.hex_array[19]+this.hex_array[18]+this.hex_array[17]+this.hex_array[16],16);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_sensors()
    {
        try
        {
            this.sensors.sensor_1=parseInt(this.hex_array[11]+this.hex_array[10]+this.hex_array[9]+this.hex_array[8],16);
            this.sensors.sensor_2=parseInt(this.hex_array[15]+this.hex_array[14]+this.hex_array[13]+this.hex_array[12],16);
            this.sensors.sensor_3=parseInt(this.hex_array[19]+this.hex_array[18]+this.hex_array[17]+this.hex_array[16],16);
            this.sensors.sensor_4=parseInt(this.hex_array[23]+this.hex_array[22]+this.hex_array[21]+this.hex_array[20],16);
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
            var status=parseInt(this.hex_array[6],16).toString(2).split('').reverse().splice(0,6);
            if(status[0]==1)
            {
                this.state_sensor_0 = true;
            }
            else
            {
                this.state_sensor_0 =false;
            }

            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    _set_status()
    {
        try
        {
            var status=parseInt(this.hex_array[6],16).toString(2).split('').reverse().splice(0,6);
            if(status[0]==1)
            {
                //размокнут
                this.state_security = true;
            }
            else
            {
                //замкнут
                this.state_security =false;
            }
            if(status[1]==1)
            {
                //вскрыт
                this.state_tamper = true;
            }
            else
            {
                //не вскрыт
                this.state_tamper = false;
            }
            if(status[2]==1)
            {
                this.hall_1=true;
            }
            else
            {
                this.hall_1=false;
            }
            if(status[3]==1)
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
    _set_state()
    {
        try
        {
            var state = this.hex_array[31].toString()+this.hex_array[30].toString()+this.hex_array[29].toString()+this.hex_array[28].toString();
            this.state = state;
            var state_int= parseInt(state,16);
            var state_binary = state_int.toString(2).split('').reverse();
            if(state_binary[0]==1)
            {
                this.state_1 = true;
            }
            else
            {
                this.state_1 = false;
            }
            if(state_binary[1]==1)
            {
                this.state_2 = true;
            }
            else
            {
                this.state_2 = false;
            }
            if(state_binary[2]==1)
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
    _set_status_tp11()
    {
        try
        {
            var status= parseInt(this.hex_array[5],16).toString(2).split('').reverse().splice(0,6);
            if(status[0]==1&&parseInt(status[0]))
            {
                this.type_powered = 'external';
            }
            else
            {
                this.type_powered = 'battery';
            }
            if(status[1]==1&&parseInt(status[1]))
            {
                this.sensor_danger_1 = true;
            }
            else
            {
               this.sensor_danger_1 = false;
            }
            if(status[2]==1&&parseInt(status[2]))
            {
                this.sensor_danger_2 = true;
            }
            else
            {
               this.sensor_danger_2 = false;
            }
            if(status[3]==1&&parseInt(status[3]))
            {
                this.sensor_out_1 = true;
            }
            else
            {
               this.sensor_out_1 = false;
            }
            if(status[4]==1&&parseInt(status[4]))
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
    _set_switch_device_smart()
    {
        try
        {
            var sw= parseInt(this.hex_array[2],16).toString(2).split('').reverse().splice(0,6);
            this.switch_device=sw;
            if(sw[0]==1)
            {
                this.type_activation = 'ABP';
            }
            else
            {
                this.type_activation = 'OTAA';
            }
            if(sw[1]==1)
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
    _set_switch_device_tp11()
    {
        try
        {
            var sw= parseInt(this.hex_array[2],16).toString(2).split('').reverse().splice(0,6);
            this.switch_device=sw;
            if(sw[0]==1)
            {
                this.type_activation = 'ABP';
            }
            else
            {
                this.type_activation = 'OTAA';
            }
            if(sw[1]==1)
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
            if(b!==undefined)
            {
                var result_int = parseInt(this.hex_array[b],16);
                if(!isNaN(result_int))
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
            if(b!==undefined)
            {
                var result_int = parseInt(this.hex_array[b],16);
                if(!isNaN(result_int))
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
//    _set_switch_device_ug()
//    {
//        try
//        {
//            this.switch_device=parseInt(this.hex_array[2],16).toString(2).split('').reverse().splice(0,8);
//            if(this.switch_device[0]==1)
//            {
//                this.type_activation = 'ABP';
//            }
//            else
//            {
//                this.type_activation = 'OTAA';
//            }
//            if(this.switch_device[1]==1)
//            {
//                this.state_ack = true;
//            }
//            else
//            {
//                this.state_ack = false;
//            }
//            var b1 = this.switch_device[2]!==undefined?this.switch_device[2].toString():'0';
//            var b2 = this.switch_device[3]!==undefined?this.switch_device[3].toString():'0';
//            var b3 = this.switch_device[4]!==undefined?this.switch_device[4].toString():'0';
//
//            var b4 = this.switch_device[5]!==undefined?this.switch_device[5].toString():'0';
//            var b5 = this.switch_device[6]!==undefined?this.switch_device[6].toString():'0';
//            var b6 = this.switch_device[7]!==undefined?this.switch_device[7].toString():'0';
//
//            var period_connect = b1+b2+b3;
//            switch (period_connect) {
//                case '001':
//                    this.period_connect_min = 60;
//                    break;
//                case '010':
//                    this.period_connect_min = 360;
//                    break;
//                case '011':
//                    this.period_connect_min = 720;
//                    break;
//                case '100':
//                    this.period_connect_min = 1440;
//                break;
//                default:
//
//                    break;
//            }
//            var period_connect_collection = b3+b5+b6;
//            switch (period_connect_collection) {
//                case '001':
//                    this.collection_period_min = 5;
//                    break;
//                case '010':
//                    this.collection_period_min = 15;
//                    break;
//                case '011':
//                    this.collection_period_min = 30;
//                    break;
//                case '100':
//                    this.collection_period_min = 60;
//                    break;
//                case '101':
//                    this.collection_period_min = 360;
//                    break;
//                case '110':
//                    this.collection_period_min = 720;
//                    break;
//                case '111':
//                    this.collection_period_min = 1440;
//                break;
//                default:
//
//                    break;
//            }
//            return true;
//        }
//        catch(err)
//        {
//            return false;
//        }
//    }
    _set_switch_device()
    {
        try
        {
            this.switch_device=parseInt(this.hex_array[2],16).toString(2).split('').reverse().splice(0,6);
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
             if(this.type_archive==0)
             {
                 time = moment(time).subtract((i-10)/4, 'hour').unix();
             }
             else if(this.type_archive==1)
             {
                 time = moment(time).subtract((i-10)/4, 'day').unix();
             } else if(this.type_archive==2)
             {
                 time = moment(time).subtract((i-10)/4, 'month').unix();
             } else if(this.type_archive==3)
             {
             }
             else
             {
                 return false;
             }
            this.archive.push([this.hex_array[i+3].toString()+this.hex_array[i+2].toString()+this.hex_array[i+1].toString()+this.hex_array[i].toString(),time]);
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
    _set_serial()
    {
        try
        {
            this.serial = this.hex_array[4].toString()+this.hex_array[3].toString()+this.hex_array[2].toString()+this.hex_array[1].toString();
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
    _set_release_date()
    {
        try
        {
            var time = this.hex_array[16].toString()+this.hex_array[15].toString()+this.hex_array[14].toString()+this.hex_array[13].toString();
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
    _set_data_b(before)
    {
        try
        {
            this.data_b = [];
            for(var i = this.hex_array.length-1; i>=before;i--)
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
    _set_rate_active()
    {
        try
        {
            this.rate_active = parseInt(this.hex_array[10],16);
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
            if(tamper==1)
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
            if(leaking==1)
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
            if(breakthrough==1)
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
    _set_status_sensor_out()
    {
        try
        {
            var numSensor = parseInt(this.hex_array[2],16);
            if(numSensor===1||numSensor===2)
            {
                var valueSensor = parseInt(this.hex_array[3],16);
                if(valueSensor)
                {
                    this['sensor_out_'+numSensor]=true;
                }
                else
                {
                    this['sensor_out_'+numSensor]=false;
                }
                //this['sensor_danger_'+numSensor]
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
            if(hall_1==1)
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
    _set_universal_int(arr_b,param)
    {
        try
        {
            var valid_arr = typeof arr_b === 'object'&&arr_b.length;
            var valid_param = typeof param === 'string';
            if(valid_arr&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if(this.hex_array[arr_b[i]]=='ff') countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if(!isNaN(result_int))
                {
                    if(countMAX!==arr_b.length)
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
    _set_universal_int_negative(arr_b,param)
    {
        try
        {
            var valid_arr = typeof arr_b === 'object'&&arr_b.length;
            var valid_param = typeof param === 'string';
            if(valid_arr&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if(this.hex_array[arr_b[i]]=='ff') countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if(!isNaN(result_int))
                {
                    var maxVal = Math.pow(2, result.length / 2 * 8);
                    if (result_int > maxVal / 2 - 1) {
                        result_int = result_int - maxVal;
                    }
                    if(countMAX!==arr_b.length)
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
            var valid_arr = typeof arr_b === 'object'&&arr_b.length;
            var valid_divider = typeof divider === 'number';
            var valid_param = typeof param === 'string';
            if(valid_arr&&valid_divider&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if(this.hex_array[arr_b[i]]=='ff') countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if(!isNaN(result_int))
                {
                    var maxVal = Math.pow(2, result.length / 2 * 8);
                    if (result_int > maxVal / 2 - 1) {
                        result_int = result_int - maxVal;
                    }
                    if(countMAX!==arr_b.length)
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
    _set_universal_float(arr_b,divider,param)
    {
        try
        {
            var valid_arr = typeof arr_b === 'object'&&arr_b.length;
            var valid_divider = typeof divider === 'number';
            var valid_param = typeof param === 'string';
            if(valid_arr&&valid_divider&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if(this.hex_array[arr_b[i]]=='ff') countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                var result_int = parseInt(result,16);
                if(!isNaN(result_int))
                {
                    if(countMAX!==arr_b.length)
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
    _set_universal_hex(arr_b,param)
    {
        try
        {
            var valid_arr = typeof arr_b === 'object'&&arr_b.length;
            var valid_param = typeof param === 'string';
            if(valid_arr&&valid_param)
            {
                var countMAX = 0;
                arr_b.reverse();
                var result='';
                for(var i = 0; i<arr_b.length;i++)
                {
                    if(this.hex_array[arr_b[i]]=='ff') countMAX++;
                    result+=this.hex_array[arr_b[i]]===undefined?'00':this.hex_array[arr_b[i]].toString();
                }
                if(countMAX!==arr_b.length)
                {
                    this[param] = result;
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
            if(res===1)
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
            if(display==1)
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
        if(this._set_charge())
        {
            if(this._set_switch_device())
            {
                if(this._set_num_channel())
                {
                    if(this._set_count())
                    {
                         if(this._set_type_archive())
                         {
                             if(this._set_last_time())
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
        if(this._set_charge())
         {
             if(this._set_switch_device())
             {
                 if(this._set_time(3,4,5,6))
                 {
                     if(this._set_temperature(7))
                     {
                          if(this._set_sensors())
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
    si_13_package_1()
    {
        var res = true;
        res=res&&this._set_switch_device();
        res=res&&this._set_temperature(7);
        res=res&&this._set_universal_int([8,9,10,11],'sensor_1');
        res=res&&this._set_universal_int([12,13,14,15],'sensor_2');
        return res;
    }
    si_13_package_2()
    {
        var res = true;
        res=res&&this._set_switch_device();
        res=res&&this._set_num_channel();
        res=res&&this._set_universal_int([4,5,6,7],'sensor_1');
        res=res&&this._set_universal_int([8,9,10,11],'sensor_2');
//        res=res&&this._set_num_channel();
//        sensors
        return res;
    }
    si_13_package_3()
    {
        var res = true;
        res=res&&this._set_universal_int([1,2],'size_data');
        res=res&&this._set_universal_int([3],'size_data_package');
        res=res&&this._set_universal_int([4],'num_package');
        res=res&&this._set_universal_int([5],'count_package');
        res=res&&this._set_data_b(6);
        return res;
    }
    si_13_package_4()
    {
        var res = true;
        res=res&&this._set_universal_hex([1,2,3,4],'address');
        res=res&&this._set_universal_boolean(5,'result');
        res=res&&this._set_universal_float([6,7,8,9],1000,'sensor_rate_1');
        res=res&&this._set_universal_float([10,11,12,13],1000,'sensor_rate_2');
        res=res&&this._set_universal_float([14,15,16,17],1000,'sensor_rate_3');
        res=res&&this._set_universal_float([18,19,20,21],1000,'sensor_rate_4');
        if(!isNaN(this.sensor_rate_1)&&!isNaN(this.sensor_rate_2)&&!isNaN(this.sensor_rate_3)&&!isNaN(this.sensor_rate_4))
        {
            this.sensor_rate_sum = this.sensor_rate_1+this.sensor_rate_2+this.sensor_rate_3+this.sensor_rate_4;
        }
        return res;
    }
    si_13_package_5()
    {
        var res = true;
        res=res&&this._set_universal_int([1],'cmd_code');
        res=res&&this._set_universal_boolean(2,'result');
        return res;
    }
    ue_package_1()
    {
        //step 5
        var res = true;
        res=res&&this._set_serial();
        res=res&&this._set_time(5,6,7,8);
        res=res&&this._set_model();
        res=res&&this._set_count_phase(10);
        res=res&&this._set_count_rate();
        res=res&&this._set_relay_state();
        res=res&&this._set_release_date();
        res=res&&this._set_version_soft();
        res=res&&this._set_kt();
        res=res&&this._set_universal_float([23,24,25,26],1000,'sensor_rate_sum');
        res=res&&this._set_temperature(27);
        res=res&&this._set_state();
        res=res&&this._set_universal_int([32],'event');
        res=res&&this._set_universal_hex([33,34],'UUID');
        return res;
    }
    ue_package_2()
    {
        var res = true;
        res=res&&this._set_serial();
        res=res&&this._set_time(5,6,7,8);
        res=res&&this._set_count_phase(9);
        res=res&&this._set_universal_float([10,11],10,'B_1');
        res=res&&this._set_universal_float([12,13],10,'B_2');
        res=res&&this._set_universal_float([14,15],10,'B_3');
        res=res&&this._set_universal_float([16,17],10,'A_1');
        res=res&&this._set_universal_float([18,19],10,'A_2');
        res=res&&this._set_universal_float([20,21],10,'A_3');
        res=res&&this._set_universal_float([22,23,24,25],1,'P_1');
        res=res&&this._set_universal_float([26,27,28,29],1,'P_2');
        res=res&&this._set_universal_float([30,31,32,33],1,'P_3');
        res=res&&this._set_universal_float([34,35,36,37],100,'Q_1');
        res=res&&this._set_universal_float([38,39,40,41],100,'Q_2');
        res=res&&this._set_universal_float([42,43,44,45],100,'Q_3');
        res=res&&this._set_universal_float([46],100,'S_1');
        res=res&&this._set_universal_float([47],100,'S_2');
        res=res&&this._set_universal_float([48],100,'S_3');
        res=res&&this._set_universal_hex([49,50],'UUID');
        return res;
    }

    ue_package_3()
    {
        var res = true;
        res=res&&this._set_size_package_in();
        res=res&&this._set_size_package_out();
        res=res&&this._set_num_out();
        res=res&&this._set_count_package();
        res=res&&this._set_data_b(6);
        return res;
    }
    ue_package_4()
    {
        var res = true;
        res=res&&this._set_serial();
        res=res&&this._set_time(5,6,7,8);
        res=res&&this._set_count_rate_active();
        res=res&&this._set_rate_active();
        res=res&&this._set_universal_float([11,12],100,'kt');
        //теперь будут в кВт*ч=)
        res=res&&this._set_universal_float([13,14,15,16],1000,'sensor_rate_sum');
        res=res&&this._set_universal_float([17,18,19,20],1000,'sensor_rate_1');
        res=res&&this._set_universal_float([21,22,23,24],1000,'sensor_rate_2');
        res=res&&this._set_universal_float([25,26,27,28],1000,'sensor_rate_3');
        res=res&&this._set_universal_float([29,30,31,32],1000,'sensor_rate_4');
        res=res&&this._set_universal_hex([33,34],'UUID');
        return res;
    }

    ue_package_5()
    {
        var res = true;
        res=res&&this._set_serial();

        res=res&&this._set_universal_int([5,6,7,8],'date_1');
       // res=res&&this._set_period_avg(9,1);
        res=res&&this._set_universal_int([9],'period_avg_1');
       // res=res&&this._set_note(10,1);
        res=res&&this._set_universal_int([10],'note_1');
        res=res&&this._set_universal_int([11,12,13,14],'A_p_1');
        res=res&&this._set_universal_int([15,16,17,18],'A_m_1');
        res=res&&this._set_universal_int([19,20,21,22],'R_p_1');
        res=res&&this._set_universal_int([23,24,25,26],'R_m_1');
        res=res&&this._set_universal_int([27,28,29,30],'date_2');
        //res=res&&this._set_period_avg(31,2);
        res=res&&this._set_universal_int([31],'period_avg_2');
       // res=res&&this._set_note(32,2);
        res=res&&this._set_universal_int([32],'note_2');
        res=res&&this._set_universal_int([33,34,35,36],'A_p_2');
        res=res&&this._set_universal_int([37,38,39,40],'A_m_2');
        res=res&&this._set_universal_int([41,42,43,44],'R_p_2');
        res=res&&this._set_universal_int([45,46,47,48],'R_m_2');
        res=res&&this._set_universal_hex([49,50],'UUID');
        return res;
    }
    ue_package_6()
    {
        var res = true;
        res=res&&this._set_serial();
        res=res&&this._set_universal_int([5],'result');
        res=res&&this._set_universal_hex([6,7],'UUID');
        return res;
    }
    ue_package_7()
    {
        var res = true;
//        res=res&&this._set_serial();
//        res=res&&this._set_time(5,6,7,8);
//        res=res&&this._set_state();
        return res;
    }
    ue_package_8()
    {
        var res = true;
//        res=res&&this._set_serial();
//        res=res&&this._set_universal_int([5],'type_in');
//        res=res&&this._set_universal_boolean(6,'result');
        return res;
    }
    lm_package_1()
    {
        var res = true;
        res=res&&this._set_universal_int([1],'charge');
        res=res&&this._set_time(2,3,4,5);
        res=res&&this._set_temperature(6);
        res=res&&this._set_universal_boolean(7,'in_move');
        res=res&&this._set_universal_float([8,9],10,'angle');
        res=res&&this._set_universal_boolean(10,'coord_status');
        res=res&&this._set_universal_float([11,12,13,14],1000000,'lat');
        res=res&&this._set_universal_float([15,16,17,18],1000000,'lon');
        res=res&&this._set_universal_int([19,20],'dir');
        res=res&&this._set_universal_int([21,22],'speed');
        res=res&&this._set_universal_int([23,24],'alt');
        res=res&&this._set_universal_int([25],'sat_visible');
        res=res&&this._set_universal_int([26],'sat_used');
        res=res&&this._set_universal_boolean([27],'alarm');
        return res;
    }
    ug_package_1()
    {
        var res = true;
        res=res&&this._set_universal_int([0],'charge');
        res=res&&this._set_time(1,2,3,4);
        res=res&&this._set_temperature(5);
        res=res&&this._set_universal_int([6],'reason');
        res=res&&this._set_universal_boolean(7,'sensor_in_1');
        res=res&&this._set_universal_boolean(8,'sensor_in_2');
        res=res&&this._set_universal_boolean(9,'sensor_out_1');
        res=res&&this._set_universal_boolean(10,'sensor_out_2');
        res=res&&this._set_universal_boolean(11,'hall_1');
        res=res&&this._set_universal_boolean(12,'state_tamper');
        res=res&&this._set_universal_float([13,14,15,16],100,'sensor_rate_sum');
        res=res&&this._set_universal_float([17,18,19,20],100,'sensor_rate_0');

//        res=res&&this._set_universal_boolean(18,'state_ack');
//        res=res&&this._set_period_connect_minute(19);
//        res=res&&this._set_collection_period_minute(20);
//        res=res&&this._set_universal_int_negative([21,22],'time_zone_minute'); //Надо переделать

        return res;
    }
    sve_1_package_1()
    {
        if(this._set_charge())
        {
            if(this._set_temperature(2))
            {
              if(this._set_hall_1())
              {
                  if(this._set_display())
                  {
                      if(this._set_time(5,6,7,8))
                      {
                          if(this._set_leaking())
                          {
                              if(this._set_breakthrough())
                              {
                                  if(!this._set_sensorKB())
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
        if(this._set_charge())
         {
             if(!this._set_status_sensor_out())
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
        if(this._set_charge())
         {
             if(this._set_switch_device_tp11())
             {
                if(this._set_temperature(3))
                {
                    if(this._set_reason(4))
                    {
                        if(this._set_status_tp11())
                        {
                            if(!this._set_sensorTP())
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

    smart_package_1()
    {
        if(this._set_charge())
         {
             if(this._set_switch_device_smart())
             {
                if(this._set_temperature_b2())
                {
                    if(this._set_reason(5))
                    {
                        if(!this._set_status_smart())
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
    td_11_package_1()
    {
        if(this._set_charge())
         {
             if(this._set_switch_device())
             {
                if(this._set_temperature_b2())
                {
                    if(this._set_reason(5))
                    {
                        if(!this._set_status())
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
        if(this._set_charge())
        {
            if(this._set_switch_device())
            {
                if(this._set_num_channel())
                {
                       this.comment=JSON.stringify(this);
                       this._set_sensors_opt();
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
    set_data(hex)
    {
        //step 3
        switch (this.device_type) {
            case 1:
                if(this._set_hex(hex))
                {
                     switch(this.type_package) {
                        case 1:
                           return this.si_11_package_1();
                        break;
                        case 2:
                           return this.si_11_package_2();
                        break;
                        case 3:  
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
            case 11:
                if(this._set_hex(hex))
                {
                     switch(this.type_package) {
                        case 1:
                           return this.si_11_package_1();
                        break;
                        case 2:
                           return this.si_11_package_2();
                        break;
                        case 3:
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
            case 3:
                if(this._set_hex(hex))
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
                 else
                 {
                    return false;
                 }
                break;
            case 4:
              //  console.log('Данные td-11');
                if(this._set_hex(hex))
                {
                    switch(this.type_package) {
                        case 1:
                           return this.td_11_package_1();
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
            case 5:
            //    console.log('Данные тп11');
                if(this._set_hex(hex))
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
                 else
                 {
                    return false;
                 }
                break;
            case 6:
             //   console.log('Данные MC');
                if(this._set_hex(hex))
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
            case 7:
              //  console.log('Данные AS');
                if(this._set_hex(hex))
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
            case 8:
              //  console.log('Данные MS');
                if(this._set_hex(hex))
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

            case 9:
             //   console.log('Данные sve1');
                if(this._set_hex(hex))
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
              //  console.log('Данные SS');
                if(this._set_hex(hex))
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
                //step 3
               // console.log('Данные УЭ');
                if(this._set_hex(hex))
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
                        case 7:
                          // return this.ue_package_7();
                        break;
                        case 8:
                          // return this.ue_package_8();
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
                if(this._set_hex(hex))
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
                if(this._set_hex(hex))
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
            default:
                console.log('Данные неизвестного для типа');
                return false;
                break;
        }
    }
}
module.exports = Parser;
