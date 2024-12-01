import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  HelperText,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../constants/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(true); // Alterna entre login e registro

  const router = useRouter();

  // Função para registrar novo usuário
  const register = async () => {
    if (!username || !password) {
      setErrorMessage('Por favor, preencha todos os campos!');
      return;
    }
    try {
      const credencial = await createUserWithEmailAndPassword(auth, username, password);
      const user = credencial.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: username,
      });
      setErrorMessage('');
      console.log('Redirecionando para o dashboard');
      router.replace('/dashboard'); 
    } catch (error) {
      setErrorMessage('Erro ao criar a conta: ' );
    }
  };

  const login = async () => {
    if (!username || !password) {
      setErrorMessage('Por favor, preencha todos os campos!');
      return;
    }
    try {
      const credencial = await signInWithEmailAndPassword(auth, username, password);
      setErrorMessage('');
      console.log('Redirecionando para o dashboard');
      router.replace('/dashboard'); 
    } catch (error) {
      setErrorMessage('Erro ao fazer login: ' );
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Animatable.View
          animation="fadeInDown"
          duration={1500}
          style={styles.header}
        >
          <Title style={styles.title}>Bem-vindo</Title>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          style={styles.form}
        >
          <TextInput
            label="E-mail"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />} 
            theme={{ colors: { placeholder: '#6200ee', text: '#000' } }}
          />
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />} 
            theme={{ colors: { placeholder: '#6200ee', text: '#000' } }}
          />
          {errorMessage ? (
            <Animatable.Text animation="shake" style={styles.errorText}>
              {errorMessage}
            </Animatable.Text>
          ) : null}
          <Button
            mode="contained"
            onPress={isRegistering ? register : login}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {isRegistering ? 'Registrar' : 'Login'}
          </Button>
          <Button
            onPress={() => setIsRegistering(!isRegistering)}
            style={styles.button}
            labelStyle={styles.link}
          >
            {isRegistering
              ? 'Já tem uma conta? Fazer login'
              : 'Não tem uma conta? Registrar'}
          </Button>
        </Animatable.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginVertical: 8,
  },
  buttonContent: {
    height: 50,
  },
  link: {
    color: '#6200ee',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default HomeScreen;
