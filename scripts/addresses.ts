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

export type ChainsAddresses = ChainAddresses[];

interface ChainAddresses {
    name: string
    chainId: any
    proxyAdmin: string
    router: string
    routerProxy: string
    bridges: Bridges
    swapImplementations: Swappers
    exchanges: Exchanges
}

type Bridges = BridgeDetails[];
type Swappers = SwapperDetails[];
type Exchanges = ExchangeDetails[];

interface SwapperDetails {
    code: number
    name: string
    address: string
}

interface ExchangeDetails {
    name: string
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

    get getBridge(): string {
        return this.data.bridges[0].address;
    }

    get getSwapperImplAddresses(): string[] {
        return this.data.swapImplementations.map(swapper => {
            return swapper.address;
        });
    }

    get getSwapperImplCodes(): number[] {
        return this.data.swapImplementations.map(swapper => {
            return swapper.code;
        });
    }

    public getExchangeAddress(name: string): string {
        const exchange = this.data.exchanges.find(exchange => {
            return exchange.name === name;
        });
        return exchange ? exchange.address : '';
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