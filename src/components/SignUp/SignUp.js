// src/components/SignUp/SignUp.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 임포트
import axios from 'axios';
import styles from './SignUp.module.css';

import { ReactComponent as JustFridgeLogo } from '../../assets/svgs/JustFridgeLogo.svg';
import { ReactComponent as ProgressBar } from '../../assets/svgs/ProgressBar.svg';

function SignUp() {
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [isIdVerified, setIsIdVerified] = useState(false);
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const [isIdLoading, setIsIdLoading] = useState(false);

    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');

    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

    // 비밀번호 유효성 검사
    useEffect(() => {
        if (password === '') {
            setPasswordMessage('');
            setIsPasswordValid(false);
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (passwordRegex.test(password)) {
            setPasswordMessage('사용 가능한 비밀번호입니다!');
            setIsPasswordValid(true);
        } else {
            setPasswordMessage('비밀번호는 8-16자, 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.');
            setIsPasswordValid(false);
        }
    }, [password]);

    // 비밀번호 확인 일치 검사
    useEffect(() => {
        if (passwordConfirm === '' && password === '') {
            setPasswordConfirmMessage('');
            setIsPasswordMatch(false);
            return;
        }
        if (passwordConfirm === '' && password !== '') {
            setPasswordConfirmMessage('');
            setIsPasswordMatch(false);
            return;
        }

        if (password === passwordConfirm) {
            setPasswordConfirmMessage('비밀번호가 일치합니다.');
            setIsPasswordMatch(true);
        } else {
            setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
            setIsPasswordMatch(false);
        }
    }, [password, passwordConfirm]);

    const handleIdCheck = async (e) => {
        e.preventDefault();
        if (!id) {
            setIdCheckMessage('아이디(이메일)를 입력해주세요.');
            return;
        }
        setIsIdLoading(true);
        setIdCheckMessage('');
        try {
            const response = await axios.get(`/auth/check-email`, { params: { email: id } });

            // --- 디버깅을 위한 로그 ---
            console.log('백엔드 응답:', response.data);

            // 백엔드의 응답 구조에 맞게 성공 조건 확인
            if (response.status === 200 && response.data.isSuccess) {
                setIsIdVerified(true);
                setIdCheckMessage('사용 가능한 아이디입니다.');
            } else {
                // isSuccess가 false이거나 없는 경우
                setIsIdVerified(false);
                setIdCheckMessage(response.data.message || '사용할 수 없는 아이디입니다.');
            }

        } catch (error) {
            // --- 디버깅을 위한 로그 ---
            console.error('API 호출 에러:', error.response || error);

            setIsIdVerified(false);
            if (error.response && error.response.data) {
                setIdCheckMessage(error.response.data.message);
            } else {
                setIdCheckMessage('중복 확인 중 오류가 발생했습니다.');
            }
        } finally {
            setIsIdLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signupData = { email: id, name: name, password: password };

        try {
            const response = await axios.post('/auth/signup', signupData);
            if (response.data.isSuccess) {
                alert('회원가입이 완료되었습니다. 추가 정보를 입력해주세요.');
                navigate('/additional-info'); // 추가 정보 입력 페이지로 이동
            }
        } catch (error) {
            alert(`회원가입 실패: ${error.response?.data?.message || '서버 오류가 발생했습니다.'}`);
        }
    };

    const isFormValid = isIdVerified && name && isPasswordValid && isPasswordMatch;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <JustFridgeLogo />
            </header>
            <main className={styles.main}>
                <h1 className={styles.title}>회원가입</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* ... (이하 JSX 코드는 이전과 동일하므로 생략) ... */}
                    {/* ... (아래는 이전 답변의 JSX를 그대로 사용하시면 됩니다) ... */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="id">아이디 (이메일)</label>
                        <div className={styles.idInputWrapper}>
                            <input type="email" id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="이메일 주소를 입력하세요" disabled={isIdVerified || isIdLoading} />
                            <button onClick={handleIdCheck} className={`${styles.verifyButton} ${isIdVerified ? styles.verified : ''}`} disabled={!id || isIdVerified || isIdLoading}>
                                {isIdLoading ? '확인 중...' : isIdVerified ? '확인 완료' : '중복 확인'}
                            </button>
                        </div>
                        {idCheckMessage && <p className={`${styles.message} ${isIdVerified ? styles.success : styles.error}`}>{idCheckMessage}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name">이름</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" />
                        {passwordMessage && <p className={`${styles.message} ${isPasswordValid ? styles.success : styles.error}`}>{passwordMessage}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="passwordConfirm">비밀번호 확인</label>
                        <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호를 다시 입력하세요" />
                        {passwordConfirmMessage && <p className={`${styles.message} ${isPasswordMatch ? styles.success : styles.error}`}>{passwordConfirmMessage}</p>}
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
                        가입하기
                    </button>
                </form>
            </main>
            <footer className={styles.footer}>
                <ProgressBar className={styles.progressBarSvg} />
            </footer>
        </div>
    );
}

export default SignUp;