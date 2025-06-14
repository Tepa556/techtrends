            <AuthModal
                isOpen={isAuthModalOpen}
                onCloseAction={() => setIsAuthModalOpen(false)}
                onLoginAction={handleLogin}
                onRegisterAction={handleRegister}
                error={authError}
                onOpenRegisterAction={() => {
                    setIsAuthModalOpen(false);
                    setIsRegModalOpen(true);
                }}
            /> 