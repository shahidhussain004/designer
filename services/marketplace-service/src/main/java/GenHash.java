import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "t7G$k9Pz!Qw2RmX4";
        String hash = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("Hash: " + hash);
        System.out.println("Verify: " + encoder.matches(password, hash));
    }
}
