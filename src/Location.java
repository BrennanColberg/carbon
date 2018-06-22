import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

public class Location {
	
	private String name;
	private List<Roll> options;
	
	public Location(String path) throws FileNotFoundException {
		this(new File(path));
	}
	public Location(File file) throws FileNotFoundException {
		this(file.getName(), new Scanner(file));
	}
	public Location(String name, Scanner input) {
		this.name = name;
		this.options = new ArrayList<Roll>();
		String message, destination;
		while (input.hasNextLine()) {
			message = input.nextLine();
			destination = input.nextLine();
			options.add(new Roll(message, destination));
		}
	}
	
	public String getName() {
		return name;
	}
	
	public Roll rollDice(Random rnd) {
		int choice = rnd.nextInt(options.size());
		return options.get(choice);
	}
	
}

class Roll {
	
	public String message;
	public String destination;
	
	public Roll(String message, String destination) {
		this.message = message;
		this.destination = destination.toUpperCase();
	}
	
}