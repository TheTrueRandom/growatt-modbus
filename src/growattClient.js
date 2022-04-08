/*
Copyright (c) 2022, TheTrueRandom
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree.
 */
import ModbusRTU from "modbus-serial";

class GrowattClient {
    constructor({device = '/dev/ttyAMA0', modbusId = 1, baudRate = 9600} = {}) {
        this.device = device;
        this.modbusId = modbusId;
        this.baudRate = baudRate;
    }

    async init() {
        this.client = new ModbusRTU();
        await this.client.connectRTUBuffered(this.device, {
            baudRate: this.baudRate,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });
        this.client.setID(this.modbusId);
        this.client.setTimeout(5000);
    }

    async getData() {
        const inputRegisters = await this.client.readInputRegisters(0, 125);
        const holdingRegisters = await this.client.readHoldingRegisters(0, 100);
        return GrowattClient.parseData(inputRegisters, holdingRegisters);

    }

    static parseData(inputRegisters, holdingRegisters) {
        const statusMap = {
            0: 'Waiting',
            1: 'Normal',
            3: 'Fault'
        }
        const errorMap = {
            201: 'Leakage current too high',
            202: 'The DC input voltage is exceeding the maximum tolerable value.',
            203: 'Insulation problem',
            300: 'Utility grid voltage is out of permissible range.',
            302: 'No AC connection',
            303: 'Utility grid frequency out of permissible range.',
            304: 'Voltage of Neutral and PE above 30V.',
            407: 'Auto test didn’t pass.'
        }

        const {data} = inputRegisters;

        return {
            status: statusMap[data[0]] || data[0],
            inputPower: data[2] / 10.0, //W
            pv1Voltage: data[3] / 10.0, //V
            pv1Current: data[4] / 10.0, //A
            pv1InputPower: data[6] / 10.0, //W
            pv2Voltage: data[7] / 10.0, //V
            pv2Current: data[8] / 10.0, //A
            pv2InputPower: data[10] / 10.0, //W
            outputPower: data[36] / 10, // W
            gridFrequency: data[37] / 100.0, // Hz
            gridVoltage: data[38] / 10.0, //V
            gridOutputCurrent: data[39] / 10.0, //A
            gridOutputPower: data[42] / 10.0, //VA
            todayEnergy: data[54] / 10.0, //kWh
            totalEnergy: data[56] / 10.0, //kWh
            totalWorkTime: data[58] / 2, //s
            pv1TodayEnergy: data[60] / 10.0, //kWh
            pv1TotalEnergy: data[62] / 10.0, //kWh
            pv2TodayEnergy: data[64] / 10.0, //kWh
            pv2TotalEnergy: data[66] / 10.0, //kWh
            pvEnergyTotal: data[92] / 10.0, //kWh
            inverterTemperature: data[93] / 10.0, //°C
            ipmTemperature: data[94] / 10.0, //°C
            inverterOutputPf: data[100], //powerfactor 0-20000
            error: errorMap[data[105]] || data[105],
            realPowerPercent: data[113], //% 0-100
            serialNumber: holdingRegisters.buffer.slice(46, 56).toString()
        }
    }
}

export default GrowattClient;
