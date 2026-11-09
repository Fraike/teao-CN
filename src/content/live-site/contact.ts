// 全站联系方式的唯一来源 —— 改这里即可同步页脚、联系页、首页与产品页。

export const contact = {
  primaryName: "罗小姐",
  primaryMobile: "18928247197",
  wechat: "jkzgg1",
  wechatQr: "/images/contact/wechat-luoxiaojie.png",
  secondaryMobile: "18617094202",
  phone: "0769-82937929",
  email: "karl@shanghaiteao.com",
  address: "广东省东莞市黄江镇黄江北三街2号",
};

export function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}
