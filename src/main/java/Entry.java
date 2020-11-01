import javax.persistence.*;

@Entity
public class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Double X;
    @Column(nullable = false)
    private Double Y;
    @Column(nullable = false)
    private Double R;
    @Column(nullable = false)
    private String session_id;
    @Column(nullable = false)
    private boolean result;

    public String getSession_id() {
        return session_id;
    }

    public void setSession_id(String session_id) {
        this.session_id = session_id;
    }

    public Double getX() {
        return X;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public void check() {
        if ((X == null) || (Y == null) || (R == null)) throw new NullPointerException();

        if ((Y == 0 && Math.abs(X) <= R) || (X == 0 && Math.abs(Y) <= R / 2))
            this.result = true;
        else if ((X < 0) && (Y < 0))
            this.result = Y >= - (R / 2) - (X / 2);
        else if ((X > 0) && (Y > 0)) {
            this.result = (X <= R) && (Y <= R / 2);
        } else if ((X > 0) && (Y < 0)) {
            this.result = X * X + Y * Y <= (R * R) / 4;
        } else if ((X < 0) && (Y > 0)) {
            this.result = false;
        }
    }

    public void setX(Double x) {
        X = x;
    }

    public Double getY() {
        return Y;
    }

    public void setY(Double y) {
        Y = y;
    }

    public Double getR() {
        return R;
    }

    public void setR(Double r) {
        R = r;
    }

    public Entry() {
    }
}
