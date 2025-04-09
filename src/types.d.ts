export type UsageId = string;

export type Block = {
  id: UsageId;
  type: string;
  display_name: string;
  children: UsageId[];
  student_view_data: {
    html: string;
  }
  links: {
    text: string;
    href: string;
  }[]
};

export type BlockMap = {
  [blockId: UsageId]: Block;
};

export type BlockResponse = {
  blocks: BlockMap;
  root: UsageId;
};
