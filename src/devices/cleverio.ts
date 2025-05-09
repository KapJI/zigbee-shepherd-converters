import * as fz from "../converters/fromZigbee";
import * as tz from "../converters/toZigbee";
import * as exposes from "../lib/exposes";
import * as reporting from "../lib/reporting";
import * as tuya from "../lib/tuya";
import type {DefinitionWithExtend} from "../lib/types";

const e = exposes.presets;
const ea = exposes.access;

export const definitions: DefinitionWithExtend[] = [
    {
        fingerprint: tuya.fingerprint("TS0219", ["_TZ3000_vdfwjopk"]),
        model: "SA100",
        vendor: "Cleverio",
        description: "Smart siren",
        fromZigbee: [fz.ts0216_siren, fz.ias_alarm_only_alarm_1, fz.power_source],
        toZigbee: [tz.warning, tz.ts0216_volume],
        exposes: [
            e.warning(),
            e.binary("alarm", ea.STATE, true, false),
            e.numeric("volume", ea.ALL).withValueMin(0).withValueMax(100).withDescription("Volume of siren"),
        ],
        meta: {disableDefaultResponse: true},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            const bindClusters = ["genPowerCfg"];
            await reporting.bind(endpoint, coordinatorEndpoint, bindClusters);
        },
    },
    {
        fingerprint: tuya.fingerprint("SM0201", ["_TYZB01_lzrhtcxu"]),
        model: "SS300",
        vendor: "Cleverio",
        description: "Temperature/humdity sensor",
        exposes: [e.battery().withAccess(ea.STATE_GET), e.temperature(), e.humidity()],
        fromZigbee: [fz.temperature, fz.humidity, fz.battery],
        toZigbee: [tz.battery_percentage_remaining],
    },
];
