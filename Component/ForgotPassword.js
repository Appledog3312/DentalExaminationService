import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [disableGetPassword, setDisableGetPassword] = useState(true);
  const [disableVerify, setDisableVerify] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const hasErrorEmail = () => !email.includes('@');
  const hasErrorNewEmail = () => !newEmail.includes('@');

  const handleSendVerificationCode = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsEmailVerified(true);
        setError('');
      })
      .catch(error => {
        console.error("Error sending verification code: ", error);
        setIsEmailVerified(false);
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      });
  };

  const handleVerifyCode = () => {
    auth()
      .confirmPasswordReset(verificationCode, password)
      .then(() => {
        setError('');
        setEmail(newEmail); // Update email
        setPassword(''); // Clear password field
        setVerificationCode(''); // Clear verification code field
        setNewEmail(''); // Clear new email field
        setIsEmailVerified(false);
        // Update email in Firestore
        firestore()
          .collection('USERS')
          .doc(email)
          .update({ email: newEmail })
          .then(() => console.log("Email updated successfully"))
          .catch(error => console.error("Error updating email: ", error));
      })
      .catch(error => {
        console.error("Error verifying code: ", error);
        setError('Mã xác nhận không hợp lệ.');
      });
  };

  useEffect(() => {
    setDisableGetPassword(email.trim() === '' || !!error || hasErrorEmail());
  }, [email, error, hasErrorEmail]);

  useEffect(() => {
    setDisableVerify(verificationCode.trim() === '' || password.trim() === '' || newEmail.trim() === '' || !!error || hasErrorNewEmail());
  }, [verificationCode, password, newEmail, error, hasErrorNewEmail]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{
        fontSize: 24,
        fontWeight: "bold",
        alignSelf: "center",
        color: "blue",
        marginTop: 100,
        marginBottom: 50
      }}>
        Forgot Password
      </Text>
      {!isEmailVerified ? (
        <>
          <TextInput
            label={"Email"}
            value={email}
            onChangeText={setEmail}
          />
          <HelperText type='error' visible={hasErrorEmail()}>
            Địa chỉ email không hợp lệ
          </HelperText>
          <Button mode='contained' textColor='black' buttonColor='pink' onPress={handleSendVerificationCode} disabled={disableGetPassword}>
            Send Verification Code
          </Button>
          {error ? <HelperText type='error'>{error}</HelperText> : null}
        </>
      ) : (
        <>
          <TextInput
            label={"Verification Code"}
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <TextInput
            label={"New Email"}
            value={newEmail}
            onChangeText={setNewEmail}
          />
          <TextInput
            label={"New Password"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button mode='contained' textColor='black' buttonColor='pink' onPress={handleVerifyCode} disabled={disableVerify}>
            Verify and Change Password
          </Button>
          {error ? <HelperText type='error'>{error}</HelperText> : null}
        </>
      )}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        <Button onPress={() => navigation.navigate("Login")}>
          Back to Login
        </Button>
      </View>
    </View>
  );
};

export default ForgotPassword;
