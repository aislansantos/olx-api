import User from "@/models/User";
import Category from "@/models/Category";
import Ads from "@/models/Ads";
import State from "@/models/State";

export const consultStates = async () => {
  const states = await State.find({});

  return states;
};

export const info = async (token: string) => {
  const user = await User.findOne({ token });
  if (user === null) {
    return;
  }

  const state = await State.findById(user.state);
  if (state === null) {
    return;
  }

  const ads = await Ads.find({ idUser: user._id.toString() });

  const adslist = [];

  for (const i in ads) {
    const cat = await Category.findById(ads[i].category);
    adslist.push({ ...ads[i], category: cat?.slug });
  }

  return {
    name: user.name,
    email: user.email,
    state: state.name,
    ads: adslist,
  };
};
