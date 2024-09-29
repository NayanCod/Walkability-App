import { address, Street } from "@prisma/client";

export interface StreetType extends Omit<Street, "createdAt" | "updatedAt"> {
  address?: AddressType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressType extends Omit<address, "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

export const convertToStreetType = (street: any) => {
  const convertedStreet: StreetType = {
    id: street.id,
    address: convertToAddressType(street.address),
    addressId: street.addressId,
    addressType: street.addresstype,
    boundingBox: street.boundingbox.map((x: any) => Number(x)),
    category: street.category,
    displayName: street.display_name,
    importance: Number(street.importance),
    name: street.name,
    osmId: street.osm_id.toString(),
    osmType: street.osm_type,
    placeId: street.place_id.toString(),
    placeRank: Number(street.place_rank),
    type: street.type,
    createdAt: street.createdAt,
    updatedAt: street.updatedAt,
  };
  return convertedStreet;
};

export const convertToAddressType = (address: any) => {
  const convertedAddress: AddressType = {
    type: address["ISO3166-2-lvl4"],
    countryCode: address.country_code,
    stateDistrict: address.state_district,
    postCode: address.postcode,
    id: address.id,
    country: address.country,
    state: address.state,
    suburb: address.suburb,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  };
  return convertedAddress;
};
