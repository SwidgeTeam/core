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
    router: string
    bridgeImplementations: Bridgers
    bridges: Bridges
    swapImplementations: Swappers
    exchanges: Exchanges
}

type Bridgers = BridgerDetails[];
type Bridges = BridgeDetails[];
type Swappers = SwapperDetails[];
type Exchanges = ExchangeDetails[];

interface BridgerDetails {
    code: number
    name: string
    address: string
}

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

    /* Own implementations */

    public getBridgeImplAddress(name: string): string {
        const bridge = this.data.bridgeImplementations.find(bridge => {
            return bridge.name === name;
        });
        return bridge ? bridge.address : '';
    }

    public getSwapperImplAddress(name: string): string {
        const swapper = this.data.swapImplementations.find(swapper => {
            return swapper.name === name;
        });
        return swapper ? swapper.address : '';
    }

    get getAllBridgeImpl(): Bridgers {
        return this.data.bridgeImplementations;
    }

    get getAllSwapperImpl(): Swappers {
        return this.data.swapImplementations;
    }

    /* External contracts */

    public getExchangeAddress(name: string): string {
        const exchange = this.data.exchanges.find(exchange => {
            return exchange.name === name;
        });
        return exchange ? exchange.address : '';
    }

    public getBridgeAddress(name: string): string {
        const bridge = this.data.bridges.find(bridge => {
            return bridge.name === name;
        });
        return bridge ? bridge.address : '';
    }

    get router(): string {
        return this.data.router;
    }

}