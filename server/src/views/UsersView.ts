import { User } from "../models/User";

export default{
  render(user: User){
    const numberDate = (user.birth_date.toString()).split(' ');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Agu","Sep","Oct","Nov","Dec"];
    const month = (months.indexOf(numberDate[1]) + 1).toString();
    const birthDate = numberDate[2] + '/' + month.padStart(2, '0') + '/' + numberDate[3];

    return{
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate
    }
  }
}