//vega_base_data.js version 2.0.0 lite
var deviceTypes=[
    {
        id:1,
        name:'СИ-11',
        count_channels:4,
        url_image:'./images/devices/si11.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['7665676173693131']
                },
                1:{
                    id: '1',
                    name:'старше 1.0',
                    settings: [4, 8, 12, 13, 14, 15, 16, 49, 55],
                    appEui:['7665676173693131']
                }
            }
        }
    },
    {
        id:2,
        name:'СИ-12',
        count_channels:4,
        url_image:'./images/devices/si12.png',
        versions:{
                default: 0,
                first: 0,
                list: {
                    0:{
                        id: '0',
                        name:'Все',
                        settings: [4, 8, 12, 13, 14, 15, 16, 49, 55],
                        appEui:['7665676173693132']
                    }
                }
            }
    },
    {
        id:3,
        name:'СИ-13',
        count_channels:14,
        url_image:'./images/devices/si13.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['7665676173693133']
                },
                1:{
                    id: '1',
                    name:'старше 1.0',
                    settings: [4, 5, 8, 12, 13, 16, 19, 22, 49, 55],
                    appEui:['3032676173693133']
                }
            }
        }
    },
    {
        id:4,
        name:'ТД-11',
        count_channels:1,
        url_image:'./images/devices/td11.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['7665676174643131']
                },
                1:{
                    id: '1',
                    name:'старше 1.0',
                    settings: [4,5,8,16,38,49,55,78,79,80,81],
                    appEui:['7665676174643131'] 
                }
            }
        }
    },
    {
        id:5,
        name:'ТП-11',
        count_channels:1,
        url_image:'./images/devices/tp11.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['7665676174703131']
                },
                1:{
                    id: '1',
                    name:'старше 1.0',
                    settings: [4,5,8,16,38,39,48,49,55,85,86],
                    appEui:['3032676174703131']
                }
            }
        }
    },
    {
        id:6,
        name:'MC-0101',
        count_channels:1,
        url_image:'./images/devices/mc.jpg',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['76616D6330313031']
                },
                1:{
                    id: '1',
                    name:'старше 1.0',
                    settings: [4, 16, 38, 39, 49],
                    appEui:['76616D6330313031']
                }
            }
        }
    },
    {
        id:7,
        name:'AS-0101',
        count_channels:1,
        url_image:'./images/devices/as.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['7661616330313031']
                },
                1:{
                    id: '1',
                    name:'старше 1.0',
                    settings: [4, 16, 44, 49],
                    appEui:['7661616330313031']
                }
            }
        }
    },
    {
        id:8,
        name:'MS-0101',
        count_channels:1,
        url_image:'./images/devices/ms.jpg',
        versions:{
            default: 2,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['766567614D533031']
                },
                1:{
                    id: '1',
                    name:'старше 1.0 и младше 1.3',
                    settings: [4, 5, 8, 16, 43, 55],
                    appEui:['766567614D533031']
                },
                2:{
                    id: '2',
                    name:'старше 1.3',
                    settings: [4, 5, 8, 16, 43, 55, 124],
                    appEui:['766567614D533031']
                }
            }
        }
    },
    {
        id:9,
        name:'СВЭ1',
        count_channels:1,
        customDevice:true,
        url_image:'./images/devices/sve.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: new Array(),
                    appEui:['7665676153564531']
                }
            }
        }
    },
    {
        id:10,
        name:'SS-0101',
        count_channels:1,
        url_image:'./images/devices/ss.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: new Array(),
                    appEui:['7665676153533031']
                }
            }
        }
    },
    {
        id:11,
        name:'CИ-21',
        count_channels:4,
        url_image:'./images/devices/si21.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 2.0',
                    settings: [4, 8, 12, 13, 14, 15, 16, 49, 55],
                    appEui:['7665676173693231']
                },
                1:{
                    id: '1',
                    name:'старше 2.0',
                    settings: [4, 8, 12, 13, 14, 15, 16, 49, 55],
                    appEui:['3032676173693231']
                }
            }
        }
    },
    {
        id:12,
        name:'Электросчетчик',
        count_channels:1,
        customDevice:true,
        url_image:'./images/devices/ue.jpg',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['7665676153454231','5345454220312020','5345454220322020']
                },
                1:{
                    id: '1',
                    name:'1.0',
                    settings: [4,16,22,50,51,52,54,55,84],
                    appEui:['7665676153454231','5345454220312020','5345454220322020']
                },
                2:{
                    id: '2',
                    name:'1.1 и старше',
                    settings: [4, 5, 8, 50, 52, 54, 55, 84, 114],
                    appEui:['7665676153454231','5345454220312020','5345454220322020']
                }
            }
        }
    },
    {
        id:13,
        name:'GM-2',
        count_channels:1,
        url_image:'./images/devices/gm.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: new Array(),
                    appEui:['76656761474D2D32']
                }
            }
        }
    },
    {
        id:14,
        name:'LM-1',
        count_channels:1,
        url_image:'./images/devices/lm.png',
        versions:{
            default: 1,
            first: 1,
            list: {
                0:{
                    id: '0',
                    name:'младше 0.5',
                    settings: new Array(),
                    appEui:['76656761204C4D31']
                },
                1:{
                    id: '1',
                    name:'0.5 и старше',
                    settings: [4,5,8,16,49,62,63,71],
                    appEui:['76656761204C4D31']
                }
            }
        }
    },
    {
        id:15,
        name:'TL-11',
        count_channels:1,
        url_image:'./images/devices/tl11.jpg',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 1.0',
                    settings: new Array(),
                    appEui:['76656761544C3131','30326761544C3131']
                },
                1:{
                    id: '1',
                    name:'1 и старше',
                    settings: [4, 5, 8, 16, 49, 55],
                    appEui:['30326761544C3131']
                }
            }
        }
    },
    {
        id:17,
        name:'GM-1',
        count_channels:1,
        url_image:'./images/devices/gm1.jpg',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 0.2',
                    settings: [1, 4, 55],
                    appEui:['76656761474D2D31']
                },
                1:{
                    id: '1',
                    name:'0.2 и старше',
                    settings: [ 4, 5, 8, 16, 55 ],
                    appEui:['76656761474D2D31']
                }
            }
        }
    },
    {
        id:18,
        name:'СИ-22',
        count_channels:4,
        url_image:'./images/devices/si22.png',
        versions:{
            default: 1,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'младше 2.0',
                    settings: [4, 8, 12, 13, 14, 15, 16, 49, 55],
                    appEui:['7665676173693232']
                },
                1:{
                    id: '1',
                    name:'старше 2.0',
                    settings: [4, 8, 12, 13, 14, 15, 16, 49, 55],
                    appEui:['3032676173693232']
                }
            }
        }
    },
    {
        id:20,
        name:'M-BUS-1',
        count_channels:12,
        url_image:'./images/devices/mbus1.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: [4,5,8,16,33,49,55],
                    appEui:['4D2D425553203120']
                }
            }
        }
    },
    {
        id:21,
        name:'M-BUS-2',
        count_channels:10,
        url_image:'./images/devices/mbus2.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: [4,5,8,16,33,49,55],
                    appEui:['4D2D425553203220']
                }
            }
        }
    },
    {
        id:23,
        name:'HS-0101',
        count_channels:1,
        url_image:'./images/devices/hs.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: [4, 16, 38, 39, 44, 49, 78, 79, 80, 81, 88, 89],
                    appEui:['736D687330313031']
                }
            }
        }
    },
    {
        id:24,
        name:'Электросчетчик СпбЗИП 2726/2727',
        count_channels:1,
        customDevice:true,
        url_image:'./images/devices/none.png',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: [4,5,8,50,52,54,55,114],
                    appEui:['5350625A49503237']
                }
            }
        }
    },
    {
        id:25,
        name:'UM-0101',
        count_channels:1,
        url_image:'./images/devices/um.jpg',
        versions:{
            default: 0,
            first: 0,
            list: {
                0:{
                    id: '0',
                    name:'Все',
                    settings: [ 16, 80, 81, 88, 89, 115, 116, 117, 118, 119, 120],
                    appEui:['4D554C53454E2031']
                }
            }
        }
    }
];
module.exports.devicesInfo = deviceTypes;
