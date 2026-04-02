export const extractLotSize = (issueInfo = []) => {
  if (!Array.isArray(issueInfo)) return null;

  const lotItem = issueInfo.find(
    (item) =>
      item?.title &&
      ["bid lot", "lot size"].includes(
        item.title.toLowerCase()
      )
  );

  if (!lotItem?.value) return null;

  // Examples:
  // "16 Equity Shares and in multiples thereof"
  // "1200 Equity Shares"
  const match = lotItem.value.match(/\d+/);

  return match ? Number(match[0]) : null;
};

export const parsePriceBand = (priceBand) => {
  if (!priceBand) return {};

  const nums = priceBand.match(/\d+/g);
  if (!nums || nums.length < 2) return {};

  console.log(nums);
  return {
    lowerPrice: Number(nums[0]),
    upperPrice: Number(nums[1]),
  };
};
