package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("words/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Words {
    
    @GET
    @Path("list")
    
    public String WordsList() {
        System.out.println("Invoked Words.WordsList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT WordID, WordName FROM Words");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject row = new JSONObject();
                row.put("WordID", results.getString(1));
                row.put("WordName", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("get/{WordID}")

    public String WordsGet(@PathParam("WordID") String WordID) {
        System.out.println("Invoked Words.WordssGet() with WordID " + WordID);

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT WordName, Token FROM Words WHERE WordID = ?");
            ps.setString(1, WordID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();

            if (results.next()) {
                response.put("WordID", WordID);
                response.put("WordName", results.getString(1));
                response.put("Token", results.getInt(2));
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
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

    @POST
    @Path("update")

    public String WordsUpdate(@FormDataParam("WordID") String WordID, @FormDataParam("WordName") String WordName) {

        try {
            System.out.println("Invoked Words.WordsUpdate/update WordID=" + WordID);
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Words SET WordName = ? WHERE WordID = ?");
            ps.setString(1, WordName);
            ps.setString(2, WordID);
            ps.execute();
            return "{\"OK\": \"Words updated\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to update item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("delete/{WordID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)

    public String WordsDelete(@PathParam("WordID") String WordID) throws Exception {
        System.out.println("Invoked Words.WordsDelete()");

        if (WordID == null) {
            throw new Exception("WordID is missing in the HTTP request's URL.");
        }

        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Words WHERE WordID = ?");
            ps.setString(1, WordID);
            ps.execute();
            return "{\"OK\": \"Word deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}
