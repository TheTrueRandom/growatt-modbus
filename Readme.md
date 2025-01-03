## Growatt Modbus
This library natively reads data provided by a growatt inverter.
Parsing is based on the documentation "Growatt Inverter Modbus RTU Protocol_II" (V1.05 2018-04-19).


## Setup
On MIN/MIC models connect the pin 3 and 4 (modbus A and B) of the growatt COM connector to a modbus to serial converter (e.g. rs485 to TTL converter). 
Multiple inverters can be connected to the same converter. 
The modbusId can be changed in the configuration menu of the inverter (default: 1).  
<img src="doc/com.jpg" height="300"/>
<img src="doc/raspberry.jpg" height="300"/>

On SPH models, set RS485 mode to VPP and use Port RS485-1, pins 4 and 5 (modbus A and B).

## Installation
```shell
yarn add growatt-modbus
```


## Usage
```js
import GrowattClient from 'growatt-modbus';

(async () => {
    const growattClient = new GrowattClient({
        baudRate: 9600,
        device: '/dev/ttyAMA0',
        modbusId: 1
    });
    await growattClient.init();
    const data = await growattClient.getData();
})();
```

## Output Example
<img src="doc/output.png" width="500"/>

## Tested devices
- [x] Growatt MIC 2500TL-X
- [x] Growatt MIN 4200TL-XE
- [x] Growatt SPH 10000TL3 BH-UP


## Contributing

The parsed data is far from everything the inverter provides but enough for my needs right now. Feel free to open a PR to support information.
