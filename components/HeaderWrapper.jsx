import { checkUser } from "@/lib/checkUser";



const HeaderWrapper = async() => {
  await checkUser();
}

export default HeaderWrapper;