import { Page } from "puppeteer";

export declare type PagesArray = {
  [key: string]: Page;
};

export declare type SelectorsArray = {
  [key: string]: string;
};

export declare type TickerObject = {
  symbol: string;
  price: number;
};
