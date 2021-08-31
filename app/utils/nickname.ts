import { getRandom } from './random'

export function defaultNickNameWithMobile(mobile: string) {
  return '用户' + mobile.slice(-4) + getRandom(3)
}
