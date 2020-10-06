package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Users{

    @GET
    @Path("list")

    public String UsersList() {
        System.out.println("Invoked Users.UsersList()");
        JSONArray response = new JSONArray();

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID, UserName FROM Users");
            ResultSet results = ps.executeQuery();

            while (results.next()) {
                JSONObject row = new JSONObject();
                row.put("UserID", results.getString(1));
                row.put("UserName", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("get/{UserID}")

    public String UsersGet(@PathParam("UserID") Integer UserID) {
        System.out.println("Invoked Users.UsersGet() with UserID " + UserID);

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserName, Token FROM Users WHERE UserID = ?");
            ps.setInt(1, UserID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();

            if (results.next()) {
                response.put("UserID", UserID);
                response.put("UserName", results.getString(1));
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

    public String UsersAdd(@FormDataParam("UserID") String UserID, @FormDataParam("UserName") String UserName, @FormDataParam("UserName") String Password) {
        System.out.println("Invoked Users.UsersAdd()");

        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Users (UserID, UserName, Password) VALUES (?, ?, ?)");
            ps.setString(1, UserID);
            ps.setString(2, UserName);
            ps.setString(3, Password);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("update")

    public String UsersUpdate(@FormDataParam("UserID") String UserID, @FormDataParam("UserName") String UserName) {

        try {
            System.out.println("Invoked Users.UsersUpdate/update UserID=" + UserID);
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Users SET UserName = ? WHERE UserID = ?");
            ps.setString(1, UserName);
            ps.setString(2, UserID);
            ps.execute();
            return "{\"OK\": \"Users updated\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to update item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("delete/{UserID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)

    public String UsersDelete(@PathParam("UserID") String UserID) throws Exception {
        System.out.println("Invoked Users.UsersDelete()");

        if (UserID == null) {
            throw new Exception("UserID is missing in the HTTP request's URL.");
        }

        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Users WHERE UserID = ?");
            ps.setString(1, UserID);
            ps.execute();
            return "{\"OK\": \"User deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}
