export interface PortfolioType {
    id: number;
    symbol: string;
    open_price: number;
    close_price: number;
    high_price: number;
    low_price: number;
    volume: number;
    change: number;
    change_percent: number;
    market_cap: number;
    currency: string;
}