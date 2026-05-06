import {atom} from 'recoil'

export const loadingAtom = atom<number>({
    key: 'loading',
    default: 0,
})