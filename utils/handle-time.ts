export class HandleTime {
  static calculateAge = (birthday) => {
    // calculate age from birthday
    const ageDifMs = Date.now() - birthday * 1000
    const ageDate = new Date(ageDifMs)
    const age = Math.abs(ageDate.getUTCFullYear() - 1970)
    return age
  }
}