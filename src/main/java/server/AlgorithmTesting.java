package server;

import java.util.Scanner;

public class AlgorithmTesting {

    public static int blacks (String word, String guess) {
        if (word.length() != guess.length()) {
            return -1;
        } else {
            int blacks = 0;
            for (int i = 0; i < word.length(); i += 1) {
                if (guess.charAt(i) == word.charAt(i)) {
                    blacks += 1;
                }
            }
            return blacks;
        }
    }

    public static int whites (String word, String guess, int blacks) {
        int whites = 0;
        for (int i = 0; i < word.length(); i += 1) {
            if (word.contains("guess.charAt(i)")) {
                whites += 1;
            }
        }
        return whites - blacks;
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

    public static int score(int attempts, int time) {
        int max = 42000;
        int points = max;
        int deduction = 1000;
        int increase = 100;
        for (int i = 1; i < attempts; i++) {
            points -= deduction + (increase * i);
        }
        return points - (15 * time);
    }


    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        while (true) {
            System.out.println("Enter attempts: ");
            int x = input.nextInt();
            System.out.println("Enter time in seconds: ");
            int y = input.nextInt();
            System.out.println(score(x,y));
        }
    }
}
