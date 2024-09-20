import { useSandbox } from "ZustandState/useSandbox";
export const useConfig = () => {
    const { sandbox } = useSandbox();

    const config = {
        apiUrl: sandbox ? 'https://sandbox.payhub.link' : 'https://api.payhub.link',
        supportApiUrl: "https://support-api.payhub.link",
        prodApiUrl: 'https://server.payhub.link',
        secretKey: 'RDKVjHKgzHRQbfjTeugL3wzxmoDsmQteZ3LKLndsJRDKVjHKgzHRQbfjTeugLRDKVjHKgzHRQbfjTeugL'
    };

    return config;
}
