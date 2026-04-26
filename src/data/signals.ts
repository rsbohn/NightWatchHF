export type SignalType = 'routine' | 'weather' | 'traffic' | 'distress' | 'anomaly';

export interface Signal {
  id: string;
  frequencyKhz: number;
  mode: 'USB' | 'LSB';
  station: string;
  ship?: string;
  type: SignalType;
  signalStrength: number;
  noise: number;
  summary: string;
  lines: string[];
}

export const signals: Signal[] = [
  {
    id: 'nmc-weather-8416',
    frequencyKhz: 8416.0,
    mode: 'USB',
    station: 'NMC',
    type: 'weather',
    signalStrength: 7,
    noise: 3,
    summary: 'Pacific weather bulletin sector ALFA.',
    lines: [
      '02:01Z NMC WX BULLETIN ALFA',
      'GALE AREA 34N-41N 153W-161W',
      'SEAS 5 TO 7 M SWELL',
      'VIS MODERATE IN RAIN BANDS',
      'NEXT ISSUE 0500Z NMC AR'
    ]
  },
  {
    id: 'wlo-gale-12577', frequencyKhz: 12577.0, mode: 'USB', station: 'WLO', type: 'weather', signalStrength: 8, noise: 2,
    summary: 'North Atlantic gale warning.',
    lines: ['03:44Z WLO GALE WRNG NR 27', 'AREA 46N 24W MOV E 20KT', 'WINDS 45KT GUST 55KT', 'ALL SHIPS REPORT ICE LIMITS', 'WLO OUT']
  },
  {
    id: 'klb-traffic-8291', frequencyKhz: 8291.0, mode: 'USB', station: 'KLB', type: 'traffic', signalStrength: 6, noise: 4,
    summary: 'Coastal traffic list and callups.',
    lines: ['01:14Z KLB TRAFFIC LIST NR 11', 'DE 3FRT7 MSG WAITING 2', 'DE V7AA3 MSG WAITING 1', 'DE 9HAQ NO TRAFFIC', 'KLB K']
  },
  {
    id: '9haq-posrep-8416', frequencyKhz: 8416.0, mode: 'USB', station: 'NMC', ship: '9HAQ', type: 'routine', signalStrength: 6, noise: 3,
    summary: '9HAQ position report relayed via NMC.',
    lines: ['02:13Z NMC DE 9HAQ QSA 3 QRK 3', '02:13Z 9HAQ DE NMC R 3 QSL', 'POSN 31N 154W', 'COURSE 245 SPEED 12', 'ETA YOKOHAMA 17/1800Z', '02:14Z 9HAQ DE NMC QSL QSL AR']
  },
  {
    id: 'cfh-radiocheck-12290', frequencyKhz: 12290.0, mode: 'USB', station: 'CFH', type: 'routine', signalStrength: 5, noise: 3,
    summary: 'Routine radio check with trawler.',
    lines: ['04:28Z CFH DE VRM219 RADIO CHECK', 'RPT QSA QRK', 'VRM219 DE CFH QSA 4 QRK 4', 'CFH DE VRM219 R R TNX']
  },
  {
    id: 'nmg-meteo-6312', frequencyKhz: 6312.0, mode: 'USB', station: 'NMG', type: 'weather', signalStrength: 7, noise: 4,
    summary: 'Meteorological bulletin Pacific East.',
    lines: ['00:02Z NMG MET BULLETIN 118', 'TROPICAL WAVE ALONG 126W', 'PRESSURE 1007 MB FALLING', 'SCATTERED TS WITH HEAVY RAIN', 'NMG AR']
  },
  {
    id: '9haq-distress-8294', frequencyKhz: 8294.0, mode: 'USB', station: '9HAQ', type: 'distress', signalStrength: 9, noise: 2,
    summary: 'Distress call: steering casualty and drift.',
    lines: ['MAYDAY MAYDAY MAYDAY', 'DE 9HAQ 9HAQ 9HAQ', 'POSN 29N 149W STEERING LOST', 'DRIFTING WNW 2KT REQUIRE ASSIST', '8 POB NO INJURY', 'STANDING BY CH16/8294 USB']
  },
  {
    id: 'anomaly-cq-10316', frequencyKhz: 10316.0, mode: 'LSB', station: 'UNKNOWN', ship: 'Vessel RUNE', type: 'anomaly', signalStrength: 4, noise: 6,
    summary: 'Repeated CQ with no responses heard.',
    lines: ['CQ CQ CQ DE RUNE', 'CQ DE RUNE 3X REPLY', 'CQ CQ DE RUNE POSITION UNKNOWN', '...NO ACKNOWLEDGEMENT...', 'CQ DE RUNE']
  },
  {
    id: 'wlo-nav-warning-8682', frequencyKhz: 8682.0, mode: 'USB', station: 'WLO', type: 'traffic', signalStrength: 6, noise: 5,
    summary: 'Navigation warning for drifting container.',
    lines: ['WLO NAVWARN 554', 'UNLIT CONTAINER ADRIFT 33N 070W', 'ALL VESSELS KEEP 5NM CPA', 'REPORT SIGHTINGS TO RCC NORFOLK']
  },
  {
    id: 'nmc-medico-12359', frequencyKhz: 12359.0, mode: 'USB', station: 'NMC', type: 'routine', signalStrength: 5, noise: 4,
    summary: 'Medico relay request forwarded.',
    lines: ['NMC DE H3KL MEDICO REQUEST', 'CREW FEVER 39C 24H', 'REQ DOCTOR PATCH 0200Z', 'NMC ROGER STANDBY']
  },
  {
    id: 'cfh-ice-6501', frequencyKhz: 6501.0, mode: 'USB', station: 'CFH', type: 'weather', signalStrength: 7, noise: 3,
    summary: 'Ice edge report for Gulf transit.',
    lines: ['CFH ICE REPORT 62', 'FAST ICE EXTENDS TO 56N 058W', 'LEAD OPENINGS VARIABLE', 'CONVOYS ADVISED DAYLIGHT PASSAGE']
  },
  {
    id: 'klb-routine-4149', frequencyKhz: 4149.5, mode: 'LSB', station: 'KLB', type: 'routine', signalStrength: 4, noise: 5,
    summary: 'Evening watch schedule handoff.',
    lines: ['KLB WATCH HANDOFF', 'NEXT OPERATOR 2200Z', 'PRIMARY 8291 SECONDARY 4149.5', 'KLB OUT']
  }
];

export const activeFrequencies = [...new Set(signals.map((s) => s.frequencyKhz))].sort((a, b) => a - b);
