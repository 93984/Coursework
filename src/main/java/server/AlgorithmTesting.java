package server;

import java.util.Arrays;

public class AlgorithmTesting {

    public static String[] stringToArray(String word) {
        String[] characters = new String[word.length()];
        for (int i = 0; i < word.length(); i++) {
            characters[i] = String.valueOf(word.charAt(i));
        }
        return characters;
    }

    public static void blacks (String[] characters, String guess) {
        if (characters.length != guess.length()) {
            System.out.println("Error");
        } else {
            int blacks = 0;
            for (int i = 0; i < characters.length; i += 1) {
                if (String.valueOf(guess.charAt(i)).equals(characters[i])) {
                    blacks += 1;
                    characters[i] = "";
                }
            }
            whites(characters, guess);
            System.out.println("Blacks: " + blacks);
        }
    }

    public static void whites (String[] characters, String guess) {
        int whites = 0;
        for (int i = 0; i < characters.length; i += 1) {
            for (int j = 0; j < characters.length; j += 1) {
                if (String.valueOf(guess.charAt(i)).equals(characters[j])){
                    whites += 1;
                    characters[i] = "";
                }
            }
        }
        System.out.println("Whites: " + whites);
    }

    public static String lowercase (String word) {
        StringBuilder lower = new StringBuilder();
        for (int i = 0; i < word.length(); i += 1) {
            int asc = (int) word.charAt(i);
            if (asc >= 65 && asc <= 90) {
                asc += 32;
            } else if (asc < 97 || asc > 122) {
                return "error";                                             // the error bit may need changing
            } char c = (char) asc;
            lower.append(c);
        } return lower.toString();
    }




    public static void main(String[] args) {






    }
}
