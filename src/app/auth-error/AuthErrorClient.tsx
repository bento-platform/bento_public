'use client';

import dynamic from 'next/dynamic';

// ssr: false so antd's cssinjs styles are applied before first paint (same approach as the main app)
const AuthErrorView = dynamic(() => import('./AuthErrorView'), { ssr: false });

export default AuthErrorView;
