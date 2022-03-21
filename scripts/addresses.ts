import addresses from "../addresses";

export function getChainAddresses(chainId: any): Addresses {
    const result = addresses.find(chain => {
        return chain.chainId === chainId;
    });
    if (!result) {
        throw new Error('No addresses for this chain')
    }
    return new Addresses(result);
}

type Bridges = BridgeDetails[];
type Swappers = ExchangeDetails[];

interface ChainAddresses {
    name: string
    chainId: any
    proxyAdmin: string
    router: string
    routerProxy: string
    bridges: Bridges
    swappers: Swappers
}

interface ExchangeDetails {
    name: string
    code: number
    address: string
}

interface BridgeDetails {
    name: string
    address: string
}

class Addresses {
    private data: ChainAddresses;

    constructor(_data: ChainAddresses) {
        this.data = _data;
    }

    public getBridge(): string {
        return this.data.bridges[0].address;
    }

    public getSwappersAddresses(): string[] {
        return this.data.swappers.map(swapper => {
            return swapper.address;
        });
    }

    public getSwappersCodes(): number[] {
        return this.data.swappers.map(swapper => {
            return swapper.code;
        });
    }

    get proxyAdmin(): string {
        return this.data.proxyAdmin;
    }

    get router(): string {
        return this.data.router;
    }

    get routerProxy(): string {
        return this.data.routerProxy;
    }

}