package com.beifen.edu.administration.dao;


import com.beifen.edu.administration.domian.Edu601;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface Edu601Dao extends JpaRepository<Edu601, Long>, JpaSpecificationExecutor<Edu601> {
    @Query(value = "select * from edu601 e where e.edu600id=?1 Order By e.update_date asc", nativeQuery = true)
    List<Edu601> getHistoryDetailByEdu600Id(String Edu600Id);
}
