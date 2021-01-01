package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("leaderboards/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Leaderboards {
    @GET
    @Path("list")

    public String LeaderboardsList() {
        System.out.println("Invoked Leaderboards.LeaderboardsList()");
        JSONArray response = new JSONArray();

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Rank, UserID, Score FROM Leaderboards");
            ResultSet results = ps.executeQuery();

            while (results.next()) {
                JSONObject row = new JSONObject();
                row.put("Rank", results.getInt(1));
                row.put("UserID", results.getString(2));
                row.put("Score", results.getInt(1));
                response.add(row);
            } return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @POST
    @Path("add")

    public String WordsAdd(@FormDataParam("WordID") String WordID, @FormDataParam("WordName") String WordName) {
        System.out.println("Invoked Words.WordsAdd()");

        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Words (WordID, WordName) VALUES (?, ?, ?)");
            ps.setString(1, WordID);
            ps.setString(2, WordName);
            ps.execute();
            return "{\"OK\": \"Added word.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }
}
