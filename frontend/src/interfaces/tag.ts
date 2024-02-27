export interface ITag {
  address: string;
  tags: string[];
}

export interface IChainTags {
  chain_id: number;
  tags: IAggregatedTag[];
}

export interface IAggregatedTag {
  tag: string;
  count: number;
}
