package server;

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




    public static String lowercase (String word) {
        StringBuilder lower = new StringBuilder();
        for (int i = 0; i < word.length(); i += 1) {
            int asc = (int) word.charAt(i);
            if (asc >= 65 && asc <= 90) {
                asc += 32;
            } else if (asc < 97 || asc > 122) {
                return "error";
            }
            char c = (char) asc;
            lower.append(c);
        }
        return lower.toString();
    }




    public static void main(String[] args) {
        System.out.println(lowercase("WORD"));
        System.out.println(lowercase("Word"));
        System.out.println(lowercase("WoRd"));
        System.out.println(lowercase("word"));
        System.out.println(lowercase("AaAa"));
        System.out.println(lowercase("ZzZz"));
        System.out.println(lowercase("W%RD"));
        System.out.println(lowercase("W0RD"));
        System.out.println(blacks("word", "door"));
        System.out.println(blacks("word", "doors"));
    }
}