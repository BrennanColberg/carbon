import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Game {
	
	public static void main(String[] args) throws FileNotFoundException {
		Scanner console = new Scanner(System.in);
		Set<Location> locations = new HashSet<Location>();
		String input = "";
		do {
			System.out.print("Please give a valid file path (\"\" to start): ");
			input = console.nextLine();
			locations.add(new Location(input));
		} while (!input.equals(""));
		
		for (Location l : locations) {
			System.out.println(l.getName());
		}
	}
}
