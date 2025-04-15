import {create} from 'zustand'
import {jwtDecode} from 'jwt-decode'
import { getAuth } from '@/api/endpoints/auth/auth'

interface JwtPayload {
    sub: string
    exp: number
    iat: number 
    [key: string]: any
}

export interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    user: JwtPayload | null
    isRefreshing: boolean
    isTokenExpired: () => boolean
    isTokenExpiringSoon: () => boolean

    setTokens: (tokens: {accessToken: string; refreshToken: string}) => void
    clearTokens: () => void
    initAuth: () => void
    refreshAccessToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isRefreshing: false,

    setTokens: ({accessToken, refreshToken}) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        const user = jwtDecode<JwtPayload>(accessToken)
        set({accessToken, refreshToken, user})
    },
    clearTokens: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({accessToken: null, refreshToken: null, user: null})
    },
    initAuth: () => {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        let user : JwtPayload | null = null
        if(accessToken){
            try{
                user = jwtDecode<JwtPayload>(accessToken)
            }catch(err){
                console.log(err);
            }
        }
        set({accessToken, refreshToken, user})
    },
    refreshAccessToken: async () => {
        if (useAuthStore.getState().isRefreshing) {
            return false;
        }
        
        const refreshToken = localStorage.getItem('refreshToken')
        if(!refreshToken) return false
        
        try {
            set({ isRefreshing: true });
            
            const auth = getAuth();
            const response = await auth.authControllerRefreshAcessToken();
            console.log('rat: ', response);
           
            const data = response.data
            const newAccessToken = data.accessToken
            const decoded = jwtDecode<JwtPayload>(newAccessToken)
            localStorage.setItem('accessToken', newAccessToken)
            set({
                accessToken: newAccessToken,
                user: decoded,
                isRefreshing: false
            })
            return true
        } catch(err) {
            console.log('lỗi refresh token!', err);
            window.alert(err)
            set({ isRefreshing: false });
            useAuthStore.getState().clearTokens()
            return false
        }
    },
    isTokenExpired: () => {
        const { user } = get();
        if (!user?.exp) return true;
        return Date.now() >= user.exp * 1000;
    },
    isTokenExpiringSoon: () => {
        const { user } = get();
        if (!user?.exp) return true;
        // Kiểm tra nếu token sẽ hết hạn trong 5 phút tới
        return Date.now() >= (user.exp * 1000) - (5 * 60 * 1000);
    },
}))