import { PortfolioType } from '../types/portfolio_types';

let portfolios: PortfolioType[] = [];

export const PortfolioModel = {
    findAll : () => portfolios,
    findById : (id:number) => portfolios.find(portfolio => portfolio.id === id),
    create : (portfolio:PortfolioType) => {
        portfolio.id = portfolios.length + 1;
        portfolios.push(portfolio);
        return portfolio;
    },
}

