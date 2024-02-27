import { IAccountProxy } from "@/interfaces/account";
import { IAccountTransaction, IAccountType } from "@/interfaces/transaction";
import axios from "axios";
import { Address, checksumAddress } from "viem";

export const getAccountTxs = async (
  address: string,
  page?: number,
  size?: number
): Promise<[IAccountTransaction[] | null, Address | null]> => {
  try {
    const checksumed = checksumAddress(address as Address);
    const url = `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/v1/address/${checksumed}?page=${page || 0}&size=${size || 50}`;
    return [
      await axios.get(url).then(
        (res) =>
          res.data?.data.map((e: IAccountTransaction) => {
            const type: IAccountType[] = [];
            if (e.from_address === checksumed) {
              type.push(IAccountType.FROM);
            }
            if (e.to_address === checksumed) {
              type.push(IAccountType.TO);
            }
            if (e.closest_address.includes(checksumed)) {
              type.push(IAccountType.RELATED);
            }
            if (e.ec_recover_addresses.includes(checksumed)) {
              type.push(IAccountType.RECOVERED);
            }
            return { ...e, type } as IAccountTransaction;
          }) || null
      ),
      checksumed,
    ];
  } catch (e) {
    return [null, null];
  }
};

export const getAccountProxy = async (
  address: string
): Promise<IAccountProxy[] | null> => {
  const checksumed = checksumAddress(address as Address);
  try {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/proxy/${checksumed}`
      )
      .then(
        (res) =>
          res.data?.data.map((e: IAccountProxy) => ({
            ...e,
            logic: checksumAddress(e.logic as Address),
          })) || null
      );
  } catch (e) {
    return null;
  }
};
